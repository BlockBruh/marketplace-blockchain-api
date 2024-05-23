import { Injectable, Logger } from '@nestjs/common';
import { ContractService } from '../../wallet/service/contract.service';
import {
  TokenDetailsDTO,
  TokenDetailsResponseDTO,
  TokenOwnerDTO,
  TokenOwnersResponseDTO,
} from '../dto/outbound.interface';
import { TokenDataDTO } from '../dto/inbound.interface';
import { NonExistentException } from '../../util/exception/http/nonexistent.exception';
import { WrongContractException } from '../../util/exception/http/wrongContract.exception';
import { DropInfo } from '../model/drop.info';

@Injectable()
export class NftService {
  private readonly logger = new Logger(NftService.name);

  constructor(private readonly contractService: ContractService) {}

  async getNftsOwners(
    tokensDataDto: TokenDataDTO[],
    correlationId: string,
  ): Promise<TokenOwnersResponseDTO[]> {
    const response: TokenOwnersResponseDTO[] = [];
    for (const tokenDataDto of tokensDataDto) {
      this.logger.log(
        `Getting owners for address: ${tokenDataDto.tokenAddress} and ids: ${tokenDataDto.tokenIds}`,
        correlationId,
      );
      const infos: TokenOwnerDTO[] = [];
      const contract = this.contractService.getNftContract(
        tokenDataDto.tokenAddress,
      );
      const calls: Promise<string>[] = [];
      for (const tokenId of tokenDataDto.tokenIds) {
        calls.push(
          contract
            .ownerOf(tokenId)
            .then((response: any) => {
              infos.push(
                new TokenOwnerDTO({
                  token_id: tokenId,
                  owner_address: response,
                }),
              );
            })
            .catch((error: Error) => {
              throw new NonExistentException(error, tokenId);
            }),
        );
      }
      response.push({
        token_address: tokenDataDto.tokenAddress,
        tokens_owners: infos,
      });
      await Promise.all(calls);
    }
    return response;
  }

  async getNftsDetails(
    tokensDataDto: TokenDataDTO[],
    correlationId: string,
  ): Promise<TokenDetailsResponseDTO[]> {
    const response: TokenDetailsResponseDTO[] = [];
    for (const tokenDataDto of tokensDataDto) {
      this.logger.log(
        `Getting infos for address: ${tokenDataDto.tokenAddress} and ids: ${tokenDataDto.tokenIds}`,
        correlationId,
      );
      const infos: TokenDetailsDTO[] = [];
      const contract = this.contractService.getNftContract(
        tokenDataDto.tokenAddress,
      );
      const calls: Promise<void>[] = [];
      for (const tokenId of tokenDataDto.tokenIds) {
        calls.push(
          contract
            .dropInfos(tokenId)
            .then((response: DropInfo) => {
              infos.push(
                new TokenDetailsDTO({
                  token_id: tokenId,
                  drop_id: response.dropId,
                  edition_number: response.editionId,
                }),
              );
            })
            .catch((error: Error) => {
              throw new WrongContractException(
                error,
                tokenDataDto.tokenAddress,
              );
            }),
        );
      }
      response.push({
        token_address: tokenDataDto.tokenAddress,
        tokens_infos: infos,
      });
      await Promise.all(calls);
    }
    return response;
  }
}
