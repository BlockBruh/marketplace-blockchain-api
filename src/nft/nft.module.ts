import { Module } from '@nestjs/common';
import { NftController } from './controller/nft.controller';
import { NftService } from './service/nft.service';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [WalletModule],
  controllers: [NftController],
  providers: [NftService],
})
export class NftModule {}
