import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  BigNumber,
  Contract,
  ethers,
  PopulatedTransaction,
  providers,
  TypedDataDomain,
  TypedDataField,
} from 'ethers';
import { VaultService } from './vault.service';
import { Web3Constants } from '../../web3/util/constants';
import { NonceService } from './nonce.service';
import { GasService } from '../../web3/service/gas.service';
import { LockService } from './lock.service';
import { NRLoggerService } from '../../logger/service/newRelic.logging.service';
import { WalletSigner } from '../../web3/service/wallet.signer';
import { Interface } from '@ethersproject/abi';
import { ContractException } from '../../util/exception/contract.exception';
import { FunctionData } from '../model/function.data';
import { NonceException } from '../../util/exception/nonce.exception';
import { ErrorDescription } from '@ethersproject/abi/src.ts/interface';
import { ContractsObjects } from '../util/constants';
import { AbisConfig } from '../../config/model/config.data';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);
  private signerWallet: WalletSigner;

  constructor(
    private readonly vaultService: VaultService,
    private readonly nonceService: NonceService,
    private readonly gasService: GasService,
    private readonly lockService: LockService,
    private readonly loggingService: NRLoggerService,
    @Inject(Web3Constants.CLIENT)
    private readonly provider: providers.JsonRpcProvider,
    @Inject(ContractsObjects.ABIS) private readonly abis: AbisConfig,
  ) {
    this.vaultService.getMnemonic().then((mnemonic) => {
      this.logger.log(`Mnemonic fetched successfully`);
      this.signerWallet = WalletSigner.fromMnemonic(mnemonic).connect(provider);
      this.logger.log(`Operator address: ${this.signerWallet.address}`);
    });
  }

  getOperatorAddress(): string {
    return this.signerWallet.address;
  }

  connectContract(contract: ethers.Contract): Contract {
    return <Contract>contract.connect(this.signerWallet);
  }

  async signTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, any>,
  ): Promise<string> {
    return await this.signerWallet._signTypedData(domain, types, value);
  }

  async sendTransaction(
    correlationId: string,
    contractTransaction: PopulatedTransaction,
    contractInterface: Interface,
  ) {
    try {
      await this.fillTransactionDetails(contractTransaction, correlationId);
    } catch (error) {
      if (error.message.includes('Error: VM')) {
        //@dev - don't even ask what this is
        const data: string = error.error.error.data.data;
        this.throwContractException(contractInterface, data, error);
      } else if (error.message.includes('execution reverted')) {
        const data: string = error.error.error.data;
        this.throwContractException(contractInterface, data, error);
      } else {
        throw error;
      }
    }
    const result = await this.sendTransactionAsync(
      contractTransaction,
      contractInterface,
      correlationId,
    );

    this.cleanupTransactionHashes(correlationId);
    return result;
  }

  private throwContractException(
    contractInterface: Interface,
    data: string,
    error: Error,
  ) {
    let parsedError: ErrorDescription;
    try {
      parsedError = contractInterface.parseError(data);
      if (parsedError.name == 'META_CALL_ERROR') {
        parsedError = this.getWrappedError(parsedError.args.error);
      }
    } catch (e) {
      parsedError = this.getWrappedError(data);
    }
    if (parsedError) {
      throw new ContractException(error, parsedError.name, parsedError.args);
    } else {
      throw new ContractException(error, undefined, undefined);
    }
  }

  private getWrappedError(data: string): ErrorDescription {
    let errorDescription: ErrorDescription;
    for (const contract of Object.values(this.abis)) {
      const iff = new Interface(contract.abi as ReadonlyArray<string>);
      try {
        errorDescription = iff.parseError(data);
        if (errorDescription) {
          //found a valid description
          break;
        }
      } catch (e) {
        // silent continue
      }
    }
    return errorDescription;
  }

  private async fillTransactionDetails(
    contractFunction: PopulatedTransaction,
    correlationId: string,
  ) {
    try {
      const gasFees = await this.gasService.getFees();
      contractFunction.maxPriorityFeePerGas = BigNumber.from(
        gasFees.maxPriorityFee,
      );
      contractFunction.maxFeePerGas = BigNumber.from(gasFees.maxFee);
    } catch (e) {
      this.logger.error(e, correlationId);
    }
    contractFunction.from = this.getOperatorAddress();
    contractFunction.gasLimit = await this.provider.estimateGas(
      contractFunction,
    );
  }

  private async sendTransactionAsync(
    contractTransaction: PopulatedTransaction,
    contractInterface: Interface,
    correlationId: string,
  ): Promise<string> {
    const releaser = await this.lockService.acquireLock(correlationId);
    const nonceData = await this.nonceService.getNonce(
      this.getOperatorAddress(),
    );
    contractTransaction.nonce = nonceData.nonce.toNumber();
    const lockReleased = false;
    return new Promise((resolve, reject) => {
      this.signerWallet
        .sendTransaction(contractTransaction)
        .then(async (transactionResponse) => {
          await this.handleTransactionHashEvent(
            this.createContractFunctionData(
              contractInterface,
              contractTransaction.from,
              contractTransaction.to,
              contractTransaction.data,
            ),
            transactionResponse.hash,
            nonceData,
            releaser,
            correlationId,
          );
          transactionResponse.wait().then((transactionReceipt) => {
            this.logContractEvents(
              transactionReceipt,
              contractInterface,
              correlationId,
            );
          });

          resolve(transactionResponse.hash);
        })
        .catch(async (error) => {
          this.loggingService.logTransactionErrorEvent(
            error.message,
            this.createContractFunctionData(
              contractInterface,
              contractTransaction.from,
              contractTransaction.to,
              contractTransaction.data,
            ),
            nonceData.nonce,
            correlationId,
          );
          this.logger.error(`Error sending async transaction: ${error}`);
          this.lockService.tryRelease(lockReleased, releaser, correlationId);
          (error.error.code && error.error.code == -32000) ||
          (error.error.error.code && error.error.error.code == -32000)
            ? reject(new NonceException(error))
            : reject(error);
        });
    });
  }

  private logContractEvents(
    transactionReceipt: ethers.providers.TransactionReceipt,
    contractInterface: Interface,
    correlationId: string,
  ) {
    for (const log of transactionReceipt.logs) {
      try {
        const logDescription = contractInterface.parseLog(log);
        this.logger.log(
          `${logDescription.name}(${logDescription.args.map((e) =>
            e.toString(),
          )})`,
          correlationId,
        );
      } catch (e) {}
    }
  }

  private createContractFunctionData(
    contractInterface: Interface,
    from,
    to,
    data,
  ): FunctionData {
    const decodedFunction: ethers.utils.TransactionDescription =
      contractInterface.parseTransaction({ data });
    return {
      from,
      to,
      name: decodedFunction.name,
      arguments: decodedFunction.args.map((a) =>
        Array.isArray(a) ? JSON.stringify(a) : a.toString(),
      ),
    };
  }

  private async handleTransactionHashEvent(
    contractFunction: FunctionData,
    transactionHash,
    nonceData,
    releaser,
    correlationId,
  ) {
    try {
      this.loggingService.logTransactionHashEvent(
        contractFunction,
        nonceData.nonce,
        correlationId,
        transactionHash,
      );
      await this.nonceService.setPendingTransactionHash(
        nonceData.nonce,
        transactionHash,
      );
      await this.nonceService.setOperatorNonce(nonceData.cachedNonce);
    } finally {
      this.lockService.tryRelease(false, releaser, correlationId);
    }
  }

  private cleanupTransactionHashes(correlationId) {
    this.nonceService
      .cleanupTransactions(this.getOperatorAddress(), correlationId)
      .then(() => {
        this.logger.log(
          'Cleanup transaction hashes from redis finished...',
          correlationId,
        );
      });
  }
}
