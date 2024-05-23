import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MarketModule } from './market/market.module';
import { Web3Module } from './web3/web3.module';
import { NftModule } from './nft/nft.module';
import { SignatureModule } from './signature/signature.module';
import { HealthModule } from './health/health.module';
import { LoggerModule } from './logger/logger.module';
import { WalletModule } from './wallet/wallet.module';
import { RedisModule } from './redis/redis.module';
import { MetatransactionModule } from './metatransaction/metatransaction.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    MarketModule,
    Web3Module,
    NftModule,
    SignatureModule,
    HealthModule,
    LoggerModule,
    WalletModule,
    RedisModule,
    MetatransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
