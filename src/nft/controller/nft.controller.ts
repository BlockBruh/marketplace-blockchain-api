import { Body, Controller, ParseArrayPipe, Post } from '@nestjs/common';
import {
  GeneralHeaders,
  RequestHeader,
} from '../../util/requestHeader.decorator';
import { CorrelationHeaderDTO, ResponseDTO } from '../../app.dto';
import {
  TokenDetailsResponseDTO,
  TokenOwnersResponseDTO,
} from '../dto/outbound.interface';
import { NftService } from '../service/nft.service';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { TokenDataDTO } from '../dto/inbound.interface';

@GeneralHeaders()
@ApiTags('nft')
@Controller('nft')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Post('/owners')
  @ApiCreatedResponse({
    description: 'Get the owners for a list of NFTs',
    type: TokenOwnersResponseDTO,
    isArray: true,
  })
  @ApiBody({ type: TokenDataDTO, isArray: true })
  async getNftsOwners(
    @RequestHeader() header: CorrelationHeaderDTO,
    @Body(new ParseArrayPipe({ items: TokenDataDTO }))
    tokensDataDto: TokenDataDTO[],
  ): Promise<ResponseDTO<TokenOwnersResponseDTO[]>> {
    return {
      response: await this.nftService.getNftsOwners(
        tokensDataDto,
        header.correlation_id,
      ),
    };
  }

  @Post('/details')
  @ApiCreatedResponse({
    description: 'Get details (dropIds and editionIds) for a list of NFTs',
    type: TokenDetailsResponseDTO,
    isArray: true,
  })
  @ApiBody({ type: TokenDataDTO, isArray: true })
  async getNftsDetails(
    @RequestHeader() header: CorrelationHeaderDTO,
    @Body(new ParseArrayPipe({ items: TokenDataDTO }))
    tokensDataDto: TokenDataDTO[],
  ): Promise<ResponseDTO<TokenDetailsResponseDTO[]>> {
    return {
      response: await this.nftService.getNftsDetails(
        tokensDataDto,
        header.correlation_id,
      ),
    };
  }
}
