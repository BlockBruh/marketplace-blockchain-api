import { Logger, Module } from '@nestjs/common';
import { BlockchainController } from './controller/blockchain.controller';
import { Web3Service } from './service/web3.service';
import { TransactionController } from './controller/transaction.controller';
import { Web3Constants } from './util/constants';
import { configService } from '../config/config.service';
import { GasService } from './service/gas.service';
import { providers } from 'ethers';

@Module({
  controllers: [BlockchainController, TransactionController],
  providers: [
    GasService,
    Web3Service,
    {
      provide: Web3Constants.CLIENT,
      useFactory: async () => {
        const rpcProvider = configService.getValue(Web3Constants.RPC);
        Web3Module.logger.log(
          `Connecting to Web3 with provider ${rpcProvider}`,
        );
        return new providers.JsonRpcProvider(rpcProvider);
      },
    },
  ],
  exports: [Web3Constants.CLIENT, GasService, Web3Service],
})
export class Web3Module {
  private static logger = new Logger(Web3Module.name);
}
