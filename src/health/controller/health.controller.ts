import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { LoggerHealthIndicator } from '../indicators/logger.health';
import { Web3HealthIndicator } from '../indicators/web3.health';
import { RedisHealthIndicator } from '../indicators/redis.health';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private logger: LoggerHealthIndicator,
    private web3: Web3HealthIndicator,
    private cache: RedisHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.logger.isHealthy('logger'),
      () => this.web3.isHealthy('web3'),
      () => this.cache.isHealthy('redis'),
    ]);
  }
}
