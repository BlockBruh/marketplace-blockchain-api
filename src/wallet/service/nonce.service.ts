import { Injectable, Logger } from '@nestjs/common';
import { Web3Service } from '../../web3/service/web3.service';
import { CacheService } from '../../redis/service/cache.service';
import { NRLoggerService } from '../../logger/service/newRelic.logging.service';
import { NonceData } from '../model/nonce.data';
import { TransactionStatusEnum } from '../../web3/util/transactionStatus.enum';
import { BigNumber, BigNumberish } from 'ethers';

@Injectable()
export class NonceService {
  private readonly logger = new Logger(NonceService.name);
  private nonceCleanupStartIndex: BigNumber;

  constructor(
    private readonly web3Service: Web3Service,
    private readonly cacheService: CacheService,
    private readonly loggingService: NRLoggerService,
  ) {
    this.logger.debug(`Initialized`);
  }

  async getNonce(address: string): Promise<NonceData> {
    const currentNonce = await this.web3Service.getNonce(address);

    const cachedNonce = await this.cacheService.getNonce();

    if (cachedNonce.lt(currentNonce)) {
      this.loggingService.logNonceEvent(
        'No pending transactions',
        currentNonce,
        cachedNonce,
        currentNonce,
        currentNonce,
      );
      return new NonceData(currentNonce, currentNonce);
    }

    if (cachedNonce.eq(currentNonce)) {
      this.loggingService.logNonceEvent(
        '1 pending transaction',
        currentNonce,
        cachedNonce,
        currentNonce.add(1),
        currentNonce.add(1),
      );
      return new NonceData(currentNonce.add(1), currentNonce.add(1));
    }
    //
    for (let i = currentNonce.add(1); i <= cachedNonce; i = i.add(1)) {
      const transactionHash = await this.cacheService.getPendingTransactionHash(
        i,
      );
      if (
        transactionHash &&
        (await this.web3Service.getTransactionStatus(transactionHash)) ===
          TransactionStatusEnum.Failed
      ) {
        this.loggingService.logNonceEvent(
          'Out of order nonce',
          currentNonce,
          cachedNonce,
          i,
          cachedNonce,
        );
        return new NonceData(i, cachedNonce);
      }
    }

    this.loggingService.logNonceEvent(
      'Multiple pending transactions',
      currentNonce,
      cachedNonce,
      cachedNonce.add(1),
      cachedNonce.add(1),
    );
    return new NonceData(cachedNonce.add(1), cachedNonce.add(1));
  }

  async setOperatorNonce(nonce: BigNumberish) {
    await this.cacheService.setNonce(nonce);
  }

  async setPendingTransactionHash(
    nonce: BigNumberish,
    transactionHash: string,
  ) {
    await this.cacheService.setPendingTransactionHash(nonce, transactionHash);
  }

  async cleanupTransactions(address, correlationId) {
    try {
      const currentNonce = await this.web3Service.getNonce(address);

      if (currentNonce.gt(0)) {
        if (!this.nonceCleanupStartIndex) {
          this.nonceCleanupStartIndex = await this.getNonceCleanupStartIndex(
            currentNonce,
          );
        }

        if (
          currentNonce
            .sub(this.nonceCleanupStartIndex.add(1))
            .gte(this.cacheService.cleanupInterval)
        ) {
          await this.cacheService.deletePendingTransactionHashes(
            this.range(this.nonceCleanupStartIndex, currentNonce.sub(1)),
          );
          this.loggingService.logCleanup(
            this.nonceCleanupStartIndex,
            currentNonce.sub(1),
          );
          this.logger.log(
            `Cleaned up cached hashes from ${
              this.nonceCleanupStartIndex
            } to ${currentNonce.sub(1)}`,
            correlationId,
          );
          this.nonceCleanupStartIndex = currentNonce.sub(1);
        }
      }
    } catch (e) {
      this.logger.error(
        `Error cleaning up cached hashes: ${e.message}`,
        correlationId,
      );
    }
  }

  private async getNonceCleanupStartIndex(currentNonce: BigNumber) {
    let start = currentNonce.sub(1);
    while (await this.cacheService.getPendingTransactionHash(start.sub(1))) {
      start = start.sub(1);
    }
    return start;
  }

  private range(start: BigNumber, end: BigNumber): string[] {
    if (start.gt(end)) {
      return [];
    } else {
      return new Array(end.sub(start).toNumber())
        .fill(0)
        .map((element, index) => start.add(index).toString());
    }
  }
}
