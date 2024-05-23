import { Controller, Get, Query } from '@nestjs/common';
import { ResponseDTO } from '../../app.dto';
import { TransactionStatusDTO } from '../dto/inbound.interface';
import { TransactionStatusEnum } from '../util/transactionStatus.enum';
import { Web3Service } from '../service/web3.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { GeneralHeaders } from '../../util/requestHeader.decorator';

@GeneralHeaders()
@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly web3Service: Web3Service) {}

  @Get('status')
  @ApiCreatedResponse({
    description: 'The transaction status',
  })
  async getTransactionStatus(
    @Query() transactionStatusDTO: TransactionStatusDTO,
  ): Promise<ResponseDTO<TransactionStatusEnum>> {
    return {
      response: await this.web3Service.getTransactionStatus(
        transactionStatusDTO.transactionHash,
      ),
    };
  }
}
