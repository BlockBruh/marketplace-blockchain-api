import { Module } from '@nestjs/common';
import { MarketController } from './controller/market.controller';
import { MarketService } from './service/market.service';
import { WalletModule } from '../wallet/wallet.module';
import { Web3Module } from '../web3/web3.module';

@Module({
  imports: [WalletModule, Web3Module],
  controllers: [MarketController],
  providers: [MarketService],
})
export class MarketModule {}
