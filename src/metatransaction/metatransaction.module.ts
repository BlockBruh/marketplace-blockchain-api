import { Module } from '@nestjs/common';
import { MetatransactionController } from './controller/metatransaction.controller';
import { MetatransactionService } from './service/metatransaction.service';
import { WalletModule } from '../wallet/wallet.module';
import { Web3Module } from '../web3/web3.module';

@Module({
  imports: [WalletModule, Web3Module],
  controllers: [MetatransactionController],
  providers: [MetatransactionService],
})
export class MetatransactionModule {}
