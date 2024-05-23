import {
  Body,
  Controller,
  Logger,
  ParseArrayPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  MintsSignatureResponse,
  SplitSignatureResponse,
} from '../dto/outbound.interface';
import { MintDataDTO, SplitDataDTO } from '../dto/inbound.interface';
import { SignatureService } from '../service/signature.service';
import { CorrelationHeaderDTO, ResponseDTO } from '../../app.dto';
import {
  GeneralHeaders,
  RequestHeader,
} from '../../util/requestHeader.decorator';
import { CustomCacheInterceptor } from '../../redis/interceptor/cache.interceptor';
import { NoCache } from '../../redis/interceptor/noCache.decorator';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ResponseException } from '../../util/exception/http/response.exception';

@GeneralHeaders()
@ApiTags('signature')
@UseInterceptors(CustomCacheInterceptor)
@Controller('signature')
export class SignatureController {
  private readonly logger = new Logger(SignatureController.name);

  constructor(private readonly signatureService: SignatureService) {}

  @NoCache()
  @Post('splits')
  async getSplitsSignature(
    @RequestHeader() header: CorrelationHeaderDTO,
    @Body() splitData: SplitDataDTO,
  ): Promise<ResponseDTO<SplitSignatureResponse>> {
    try {
      return {
        response: await this.signatureService.signSplits(splitData),
      };
    } catch (e) {
      this.logger.error(e, header.correlation_id);
      throw new ResponseException(e);
    }
  }

  @Post('mints')
  @ApiCreatedResponse({
    description: 'Get signature for mint data',
    type: MintsSignatureResponse,
  })
  @ApiBody({ type: MintDataDTO, isArray: true })
  async getMintsSignature(
    @RequestHeader() header: CorrelationHeaderDTO,
    @Body(new ParseArrayPipe({ items: MintDataDTO })) mints: MintDataDTO[],
  ): Promise<ResponseDTO<MintsSignatureResponse>> {
    try {
      return {
        response: await this.signatureService.signMints(mints),
      };
    } catch (e) {
      this.logger.error(e, header.correlation_id);
      throw new ResponseException(e);
    }
  }
}
