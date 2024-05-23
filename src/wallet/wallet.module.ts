import { Module } from '@nestjs/common';
import { WalletService } from './service/wallet.service';
import { VaultService } from './service/vault.service';
import { Web3Module } from '../web3/web3.module';
import { LoggerModule } from '../logger/logger.module';
import { LockService } from './service/lock.service';
import { RedisModule } from '../redis/redis.module';
import { NonceService } from './service/nonce.service';
import { ContractsObjects } from './util/constants';
import { configService } from '../config/config.service';
import { ContractService } from './service/contract.service';
import { CacheService } from '../redis/service/cache.service';
import { NRLoggerService } from '../logger/service/newRelic.logging.service';

@Module({
  imports: [Web3Module, RedisModule, LoggerModule],
  providers: [
    WalletService,
    VaultService,
    LockService,
    NonceService,
    {
      provide: ContractsObjects.ABIS,
      useValue: configService.getAbisConfig(),
    },
    ContractService,
    CacheService,
    NRLoggerService,
  ],
  exports: [WalletService, ContractService],
})
export class WalletModule {}
