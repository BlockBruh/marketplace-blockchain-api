import { Module } from '@nestjs/common';
import { HealthController } from './controller/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { LoggerHealthIndicator } from './indicators/logger.health';
import { LoggerModule } from '../logger/logger.module';
import { Web3HealthIndicator } from './indicators/web3.health';
import { Web3Module } from '../web3/web3.module';
import { RedisHealthIndicator } from './indicators/redis.health';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [TerminusModule, LoggerModule, Web3Module, RedisModule],
  controllers: [HealthController],
  providers: [LoggerHealthIndicator, Web3HealthIndicator, RedisHealthIndicator],
  exports: [TerminusModule],
})
export class HealthModule {}
