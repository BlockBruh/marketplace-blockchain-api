import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { Web3Service } from '../service/web3.service';
import { CustomCacheInterceptor } from '../../redis/interceptor/cache.interceptor';
import { ResponseDTO } from '../../app.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { GeneralHeaders } from '../../util/requestHeader.decorator';

@GeneralHeaders()
@ApiTags('blockchain')
@UseInterceptors(CustomCacheInterceptor)
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly web3Service: Web3Service) {}

  @Get('chain_id')
  @ApiCreatedResponse({
    description: 'The chain id that the API is connected to',
  })
  async getChainId(): Promise<ResponseDTO<number>> {
    return {
      response: await this.web3Service.getChainId(),
    };
  }
}
