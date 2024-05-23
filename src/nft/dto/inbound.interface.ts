import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';
import {
  Is20BytesHex,
  IsBigNumberArray,
} from '../../util/validator/decorators';
import { BigNumber } from 'ethers';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class TokenDataDTO {
  @ApiProperty({
    name: 'token_address',
    type: 'string',
    example: '0xaE8EF9C432c69b45385Ccc1e7809b821E684e7ec',
  })
  @IsNotEmpty()
  @Is20BytesHex()
  @Expose({ name: 'token_address' })
  tokenAddress: string;

  @ApiProperty({
    name: 'token_ids',
    type: BigNumber,
    isArray: true,
    example: [100, 200, 300],
  })
  @IsNotEmpty()
  @IsBigNumberArray()
  @IsArray()
  @ArrayMinSize(1)
  @Transform(({ value }) => {
    return value.map((i) => BigNumber.from(i));
  })
  @Expose({ name: 'token_ids' })
  tokenIds: BigNumber[];
}
