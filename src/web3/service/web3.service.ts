import { Inject, Injectable, Logger } from '@nestjs/common';
import { TransactionStatusEnum } from '../util/transactionStatus.enum';
import { Web3Constants } from '../util/constants';
import { BigNumber, providers } from 'ethers';

@Injectable()
export class Web3Service {
  private readonly logger = new Logger(Web3Service.name);

  private chainId: number;

  constructor(
    @Inject(Web3Constants.CLIENT)
    private readonly provider: providers.Provider,
  ) {
    this.getChainId()
      .then((chainId) => this.logger.log(`Running on chain id ${chainId}`))
      .catch((error) => this.logger.error(`Error fetching chain id: ${error}`));
    this.getBlockNumber()
      .then((value) =>
        this.logger.log(`Latest block number of blockchain: ${value}`),
      )
      .catch((error) =>
        this.logger.error(`Error fetching latest block number: ${error}`),
      );
  }

  async getTransactionStatus(
    transactionHash: string,
  ): Promise<TransactionStatusEnum> {
    const tx = await this.provider.getTransaction(transactionHash);
    if (tx) {
      if (!tx.blockNumber) {
        return TransactionStatusEnum.Pending;
      } else {
        const receipt = await this.provider.getTransactionReceipt(
          transactionHash,
        );
        if (receipt.status) {
          return TransactionStatusEnum.Confirmed;
        }
      }
    }
    return TransactionStatusEnum.Failed;
  }

  async getChainId(): Promise<number> {
    if (!this.chainId) {
      this.chainId = (await this.provider.getNetwork()).chainId;
    }
    return this.chainId;
  }

  async getBlockNumber(): Promise<number> {
    return await this.provider.getBlockNumber();
  }

  async getNonce(address: string): Promise<BigNumber> {
    return BigNumber.from(await this.provider.getTransactionCount(address));
  }

  async getBalance(address: string): Promise<BigNumber> {
    return this.provider.getBalance(address);
  }
}
