import { Inject, Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import Redis from 'ioredis';
import { RedisObjects } from '../../redis/util/constants';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(
    @Inject(RedisObjects.CLIENT)
    private readonly redisClient: Redis,
  ) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const isHealthy = (await this.redisClient.status) === 'ready';
    const result = this.getStatus(key, isHealthy, {});

    if (isHealthy) {
      return result;
    }
    throw new HealthCheckError('redis check failed', result);
  }
}
