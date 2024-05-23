import { Inject, Injectable, Logger } from '@nestjs/common';
import { configService } from '../../config/config.service';
import { RedisObjects } from '../util/constants';
import { BigNumber, BigNumberish } from 'ethers';
import Redis from 'ioredis';
import { RedisKeys } from '../../config/model/config.data';
import { RedisKeysConstants } from '../../config/util/constants';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  public readonly cleanupInterval: number;

  constructor(
    @Inject(RedisObjects.CLIENT)
    private readonly redisClient: Redis,
    @Inject(RedisObjects.KEYS)
    private readonly redisKeys: RedisKeys,
  ) {
    this.cleanupInterval = Number.parseInt(
      configService.getValue(RedisKeysConstants.CLEANUP_INTERVAL),
    );
    this.logger.debug(`Initialized`);
  }

  async getNonce(): Promise<BigNumber> {
    const nonce = await this.redisClient.get(this.redisKeys.nonceKey);
    if (nonce) {
      return BigNumber.from(nonce);
    }
    return BigNumber.from(-1);
  }

  async setNonce(nonce: BigNumberish) {
    const key = this.redisKeys.nonceKey;
    await this.redisClient
      .set(key, nonce.toString())
      .then(() => {
        this.logger.log(`Saved: ${key}=${nonce}`);
      })
      .catch((reason) => {
        this.logger.error(
          `Failed to save ${key}=${nonce} because of ${reason}`,
        );
      });
  }

  async getPendingTransactionHash(nonce: BigNumber): Promise<string> {
    return this.redisClient.hget(this.redisKeys.hashmapKey, nonce.toString());
  }

  async setPendingTransactionHash(
    nonce: BigNumberish,
    transactionHash: string,
  ) {
    await this.redisClient.hset(
      this.redisKeys.hashmapKey,
      nonce.toString(),
      transactionHash,
    );
  }

  async deletePendingTransactionHashes(nonces: string[]) {
    return this.redisClient.hdel(this.redisKeys.hashmapKey, ...nonces);
  }
}
