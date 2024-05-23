import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { Is32BytesHex } from '../../util/validator/decorators';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionStatusDTO {
  @ApiProperty({
    name: 'transaction_id',
    description: 'The transaction hash',
    example:
      '0x314179f3183bbe4748239216b5b601fb81b8b2a73dc3e0f9bfaa6146c5703f90',
  })
  @IsNotEmpty()
  @Is32BytesHex()
  @Expose({ name: 'transaction_id' })
  transactionHash: string;
}
