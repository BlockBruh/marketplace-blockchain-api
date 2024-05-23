import { IsNotEmpty } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import {
  Is20BytesHex,
  Is65BytesHex,
  IsBigNumber,
  IsHex,
} from '../../util/validator/decorators';
import { ApiProperty } from '@nestjs/swagger';
import { BigNumber } from 'ethers';

export class ChainIdDTO {
  @ApiProperty({
    type: 'number',
    description: 'The chain id',
    example: '80001',
  })
  @IsNotEmpty()
  @IsBigNumber()
  @Transform(({ value }) => BigNumber.from(value))
  chainId: BigNumber;
}

export class MetatransactionDTO {
  @ApiProperty({
    name: 'executing_contract',
    type: 'string',
    description: 'The address of the executing contract',
    example: '0xD4372620822Db34672773830dAaD592cb94d75A9',
  })
  @IsNotEmpty()
  @Is20BytesHex()
  @Expose({ name: 'executing_contract' })
  executingContract: string;

  @ApiProperty({
    name: 'user_address',
    type: 'string',
    description: 'The address of the user for metatransaction',
    example: '0x4fF5DDB196A32e3dC604abD5422805ecAD22c468',
  })
  @IsNotEmpty()
  @Is20BytesHex()
  @Expose({ name: 'user_address' })
  userAddress: string;

  @ApiProperty({
    name: 'function_signature',
    type: 'string',
    description: 'The encoded payload of the function',
    example:
      '0xa22cb4650000000000000000000000004d8b42842bd3f415c1b41ae61c8fe0e0ad2888340000000000000000000000000000000000000000000000000000000000000001',
  })
  @IsNotEmpty()
  @IsHex()
  @Expose({ name: 'function_signature' })
  functionSignature: string;

  @ApiProperty({
    name: 'signature',
    type: 'string',
    description: 'The signature of the metatransaction payload',
    example:
      '0xb141849137c220d211258e7c1b06582f310107a8d94461d6ed87ec91f399d6810ef36c36d912e2572c1cc9c90f9f683660ad2a3a130bd0783ba049ef627b81e11c',
  })
  @IsNotEmpty()
  @Is65BytesHex()
  signature: string;
}
