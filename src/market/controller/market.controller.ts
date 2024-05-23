import {
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  UseGuards,
  Version,
} from '@nestjs/common';
import { MarketService } from '../service/market.service';
import { CorrelationHeaderDTO, ResponseDTO } from '../../app.dto';
import {
  GeneralHeaders,
  RequestHeader,
} from '../../util/requestHeader.decorator';
import {
  BuyFiatDTO,
  BuyFiatDTOV2,
  TokenAddressParam,
} from '../dto/inbound.interface';
import { TransactionIdResponse } from '../../nft/dto/outbound.interface';
import { TransactionException } from '../../util/exception/http/transaction.exception';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { PaymentGuard } from '../../util/guard/payment.guard';
import { BigNumber } from 'ethers';
import { UserDataResponseDTO } from '../dto/outbound.interface';

@GeneralHeaders()
@ApiTags('market')
@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Version('1')
  @Post('purchase/fiat')
  @UseGuards(PaymentGuard)
  @ApiCreatedResponse({
    description: 'Buy new NFTs with fiat',
    type: 'string',
  })
  async buyFiat(
    @RequestHeader() header: CorrelationHeaderDTO,
    @Body() buyFiatDto: BuyFiatDTO,
  ): Promise<ResponseDTO<TransactionIdResponse>> {
    try {
      return {
        response: await this.marketService.buyFiat(
          buyFiatDto,
          header.correlation_id,
        ),
      };
    } catch (error) {
      throw new TransactionException(error);
    }
  }

  @Version('2')
  @Post('purchase/fiat')
  @UseGuards(PaymentGuard)
  @ApiCreatedResponse({
    description: 'Buy new NFTs with fiat',
    type: 'string',
  })
  async buyFiatV2(
    @RequestHeader() header: CorrelationHeaderDTO,
    @Body() buyFiatDto: BuyFiatDTOV2,
  ): Promise<ResponseDTO<TransactionIdResponse>> {
    try {
      return {
        response: await this.marketService.buyFiatV2(
          buyFiatDto,
          header.correlation_id,
        ),
      };
    } catch (error) {
      throw new TransactionException(error);
    }
  }

  @Get('fees/:tokenAddress')
  @ApiCreatedResponse({
    description: 'Get marketplace fees for a certain token (native/ERC20)',
    type: BigNumber,
  })
  async getFees(
    @RequestHeader() header: CorrelationHeaderDTO,
    @Param() param: TokenAddressParam,
  ): Promise<ResponseDTO<string>> {
    return {
      response: (
        await this.marketService.getBalance(
          param.tokenAddress,
          header.correlation_id,
        )
      ).toString(),
    };
  }

  @Post('/allowance')
  @ApiCreatedResponse({
    description:
      'Get marketplace WETH allowance and balance for a list of users',
    type: UserDataResponseDTO,
    isArray: true,
  })
  @ApiBody({ type: String, isArray: true })
  async getAllowanceAndBalance(
    @RequestHeader() header: CorrelationHeaderDTO,
    @Body(new ParseArrayPipe({ items: String }))
    users: string[],
  ): Promise<ResponseDTO<UserDataResponseDTO[]>> {
    return {
      response: await this.marketService.getAllowanceForUsers(
        users,
        header.correlation_id,
      ),
    };
  }
}
