import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import {
  GeneralHeaders,
  RequestHeader,
} from '../../util/requestHeader.decorator';
import { CorrelationHeaderDTO, ResponseDTO } from '../../app.dto';
import { TransactionIdResponse } from '../../nft/dto/outbound.interface';
import { TransactionException } from '../../util/exception/http/transaction.exception';
import { ChainIdDTO, MetatransactionDTO } from '../dto/inbound.interface';
import { MetatransactionService } from '../service/metatransaction.service';
import { PaymentGuard } from '../../util/guard/payment.guard';

@GeneralHeaders()
@ApiTags('transaction')
@Controller('transaction')
export class MetatransactionController {
  constructor(
    private readonly metatransactionService: MetatransactionService,
  ) {}

  @Post('meta/:chainId')
  @UseGuards(PaymentGuard)
  @ApiCreatedResponse({
    description: 'Send metatransaction',
    type: 'string',
  })
  async metatransaction(
    @RequestHeader() headers: CorrelationHeaderDTO,
    @Param() chainIdDto: ChainIdDTO,
    @Body() metatransactionDto: MetatransactionDTO,
  ): Promise<ResponseDTO<TransactionIdResponse>> {
    try {
      return {
        response: await this.metatransactionService.sendMetatransaction(
          chainIdDto.chainId,
          metatransactionDto,
          headers.correlation_id,
        ),
      };
    } catch (error) {
      throw new TransactionException(error);
    }
  }
}
