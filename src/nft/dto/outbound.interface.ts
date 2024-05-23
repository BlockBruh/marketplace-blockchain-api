import { ApiProperty } from '@nestjs/swagger';
import { BigNumber } from 'ethers';
import { IsBigNumber } from '../../util/validator/decorators';
import { Transform } from 'class-transformer';

export class TransactionIdResponse {
  static transaction_id: string;
}

export class TokenOwnerDTO {
  constructor(partial: Partial<TokenOwnerDTO>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ name: 'owner_address', type: 'string' })
  owner_address: string;

  @IsBigNumber()
  @Transform(({ value }) => {
    return (value as BigNumber).toString();
  })
  @ApiProperty({ name: 'token_id', type: BigNumber })
  token_id: BigNumber;
}

export class TokenOwnersResponseDTO {
  @ApiProperty({ name: 'token_address', type: 'string' })
  token_address: string;

  @ApiProperty({ name: 'tokens_owners', type: TokenOwnerDTO, isArray: true })
  tokens_owners: TokenOwnerDTO[];
}

export class TokenDetailsDTO {
  constructor(partial: Partial<TokenDetailsDTO>) {
    Object.assign(this, partial);
  }

  @IsBigNumber()
  @Transform(({ value }) => {
    return (value as BigNumber).toString();
  })
  @ApiProperty({ name: 'drop_id', type: BigNumber })
  drop_id: BigNumber;

  @IsBigNumber()
  @Transform(({ value }) => {
    return (value as BigNumber).toString();
  })
  @ApiProperty({ name: 'edition_number', type: BigNumber })
  edition_number: BigNumber;

  @IsBigNumber()
  @Transform(({ value }) => {
    return (value as BigNumber).toString();
  })
  @ApiProperty({ name: 'token_id', type: BigNumber })
  token_id: BigNumber;
}

export class TokenDetailsResponseDTO {
  @ApiProperty({ name: 'token_address', type: 'string' })
  token_address: string;

  @ApiProperty({ name: 'tokens_infos', type: TokenDetailsDTO, isArray: true })
  tokens_infos: TokenDetailsDTO[];
}
