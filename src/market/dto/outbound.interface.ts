import { IsBigNumber } from '../../util/validator/decorators';
import { Transform } from 'class-transformer';
import { BigNumber } from 'ethers';
import { ApiProperty } from '@nestjs/swagger';

export class UserDataResponseDTO {
  constructor(partial: Partial<UserDataResponseDTO>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ name: 'user_address', type: 'string' })
  user_address: string;

  @IsBigNumber()
  @Transform(({ value }) => {
    return (value as BigNumber).toString();
  })
  @ApiProperty({ name: 'allowance', type: BigNumber })
  allowance: BigNumber;

  @IsBigNumber()
  @Transform(({ value }) => {
    return (value as BigNumber).toString();
  })
  @ApiProperty({ name: 'balance', type: BigNumber })
  balance: BigNumber;
}
