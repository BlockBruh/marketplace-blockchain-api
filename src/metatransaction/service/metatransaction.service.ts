import { Injectable, Logger } from '@nestjs/common';
import { WalletService } from '../../wallet/service/wallet.service';
import { ContractService } from '../../wallet/service/contract.service';
import { MetatransactionDTO } from '../dto/inbound.interface';
import { TransactionIdResponse } from '../../nft/dto/outbound.interface';
import { Web3Service } from '../../web3/service/web3.service';
import { splitSignature } from 'ethers/lib/utils';
import { BigNumber, PopulatedTransaction } from 'ethers';

@Injectable()
export class MetatransactionService {
  private readonly logger = new Logger(MetatransactionService.name);

  constructor(
    private readonly contractService: ContractService,
    private readonly walletService: WalletService,
    private readonly web3Service: Web3Service,
  ) {}

  async sendMetatransaction(
    chainId: BigNumber,
    metatransactionDto: MetatransactionDTO,
    correlationId: string,
  ): Promise<TransactionIdResponse> {
    this.logger.log(
      `Sending metatransaction to executing contract ${metatransactionDto.executingContract} for user ${metatransactionDto.userAddress} with signature ${metatransactionDto.functionSignature}`,
      correlationId,
    );
    if (!chainId.eq(BigNumber.from(await this.web3Service.getChainId()))) {
      throw new Error(
        `Chain id does not match ${await this.web3Service.getChainId()}`,
      );
    }
    const executingContract = this.contractService.getMetaTransactionContract(
      metatransactionDto.executingContract,
    );
    const signatureDetails = splitSignature(metatransactionDto.signature);
    const executeMetaTransaction: PopulatedTransaction =
      await this.walletService
        .connectContract(executingContract)
        .populateTransaction.executeMetaTransaction(
          metatransactionDto.userAddress,
          metatransactionDto.functionSignature,
          signatureDetails.r,
          signatureDetails.s,
          signatureDetails.v,
        );
    const transactionHash = await this.walletService.sendTransaction(
      correlationId,
      executeMetaTransaction,
      executingContract.interface,
    );
    return {
      transaction_id: transactionHash,
    };
  }
}
