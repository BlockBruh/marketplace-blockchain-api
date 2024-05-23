import { Module } from '@nestjs/common';
import { SignatureController } from './controller/signature.controller';
import { SignatureService } from './service/signature.service';
import { Web3Module } from '../web3/web3.module';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  controllers: [SignatureController],
  imports: [Web3Module, WalletModule],
  providers: [SignatureService],
})
export class SignatureModule {}
