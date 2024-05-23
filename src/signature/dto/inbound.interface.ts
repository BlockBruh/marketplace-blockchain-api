import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  Is20BytesHex,
  Is65BytesHex,
  IsBigNumber,
  IsBigNumberPercent,
  IsIpfsUrl,
} from '../../util/validator/decorators';
import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BigNumber } from 'ethers';

export class Payment {
  @ApiProperty({
    name: 'amount',
    description: 'The number of WEI to be paid',
    example: '1000000',
  })
  @IsNotEmpty()
  @IsBigNumber()
  @Transform(({ value }) => BigNumber.from(value))
  @Expose({ name: 'amount' })
  amount: BigNumber;

  @ApiProperty({
    name: 'recipient',
    description: 'The recipient of the amount',
    example: '0xD4372620822Db34672773830dAaD592cb94d75A9',
  })
  @IsNotEmpty()
  @IsString()
  @Is20BytesHex()
  @Expose({ name: 'recipient' })
  recipient: string;
}

export class SplitDataDTO {
  @ApiProperty({
    name: 'buyer',
    description: 'The recipient of the amount',
    example: '0xD4372620822Db34672773830dAaD592cb94d75A9',
  })
  @IsNotEmpty()
  @IsString()
  @Is20BytesHex()
  @Expose({ name: 'buyer' })
  buyer: string;

  @ApiProperty({
    name: 'payments',
    description: 'Array of payments',
    type: Payment,
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => Payment)
  payments: Payment[];

  @ApiProperty({
    name: 'action_expiration_timestamp',
    description:
      'The timestamp when the transaction will become invalid in blockchain',
    example: '1774126099',
  })
  @IsNotEmpty()
  @IsBigNumber()
  @Expose({ name: 'action_expiration_timestamp' })
  actionExpiration: number;

  @ApiProperty({
    name: 'token_address',
    description: 'The NFT contract address',
    example: '0xD4372620822Db34672773830dAaD592cb94d75A9',
  })
  @IsNotEmpty()
  @IsString()
  @Is20BytesHex()
  @Expose({ name: 'token_address' })
  token: string;

  @ApiProperty({
    description: 'The chain id for the sell',
    example: '80001',
  })
  @IsNotEmpty()
  @IsBigNumber()
  chain_id: number;

  @ApiPropertyOptional({
    name: 'mints_signature',
    description: 'The mint data signature',
    example:
      '0xb09c57ae39b65d20ae9cee97df83b2bc8577a0488c140461ab1f64d1d387ccbc4b30d2fbfe84fa1d2cca3dd7e004d024eaa8cd091b4c79484c9e73857c7d32941b',
  })
  @IsOptional()
  @Is65BytesHex()
  @Expose({ name: 'mints_signature' })
  mintsSignature?: string;

  @ApiPropertyOptional({
    name: 'sell_nonces',
    description: 'Sell nonces array',
    example: [
      '0xefee05c3db9a6134ea1c5d84365149ddd01c2bae7515db49bf13c76e08e70341',
      '0xefee05c3db9a6134ea1c5d84365149ddd01c2bae7515db49bf13c76e08e70341',
    ],
  })
  @IsOptional()
  @Expose({ name: 'sell_nonces' })
  sellNonces?: string[];
}

export class DropData {
  @ApiProperty({
    name: 'drop_id',
    type: 'number',
    description: 'The drop id',
    example: '100000',
  })
  @IsNotEmpty()
  @IsBigNumber()
  @Transform(({ value }) => BigNumber.from(value))
  @Expose({ name: 'drop_id' })
  dropId: BigNumber;

  @ApiProperty({
    name: 'max_copies',
    type: 'number',
    description: 'The number of max copies for the drop',
    example: '10',
  })
  @IsNotEmpty()
  @IsBigNumber()
  @Transform(({ value }) => BigNumber.from(value))
  @Expose({ name: 'max_copies' })
  maxEditions: BigNumber;

  @ApiProperty({
    name: 'mint_copies',
    type: 'number',
    description: 'The number of copies to mint from the drop',
    example: '2',
  })
  @IsNotEmpty()
  @IsBigNumber()
  @Transform(({ value }) => BigNumber.from(value))
  @Expose({ name: 'mint_copies' })
  mintEditions: BigNumber;

  @ApiProperty({
    name: 'creator_address',
    description: 'The address of the creator',
    example: '0x8f161ad86E385EEc75543fd537Dc45A715127181',
  })
  @IsNotEmpty()
  @Is20BytesHex()
  @Expose({ name: 'creator_address' })
  creatorAddress: string;

  @ApiProperty({
    name: 'metadata_url',
    description: 'The ipfs url with the metadata',
    example:
      'ipfs://bafybeigahln7ush3o7awps5cnnjfo7xrxkhooprjlnl7k3dovwtc5a2qmy',
  })
  @IsNotEmpty()
  @IsIpfsUrl()
  @Expose({ name: 'metadata_url' })
  tokenUri: string;

  @ApiProperty({
    name: 'royalties_percent',
    description: 'The royalties percentage in BPS',
    example: '1000',
  })
  @IsNotEmpty()
  @IsBigNumberPercent()
  @Transform(({ value }) => BigNumber.from(value))
  @Expose({ name: 'royalties_percent' })
  royaltiesPercent: BigNumber;

  @ApiProperty({
    name: 'utility_ids',
    description: 'Array of utility ids',
    type: String,
    isArray: true,
    example: ['hasUtility', ''],
  })
  @IsNotEmpty()
  @Expose({ name: 'utility_ids' })
  utilityIds: string[];
}

export class MintDataDTO {
  @ApiProperty({
    name: 'nft_address',
    description: 'The address of the NFT contract',
    example: '0xaE8EF9C432c69b45385Ccc1e7809b821E684e7ec',
  })
  @IsNotEmpty()
  @Is20BytesHex()
  @Expose({ name: 'nft_address' })
  nftAddress: string;

  @ApiProperty({
    name: 'drops',
    description: 'Array of drop data DTOs',
    type: DropData,
    isArray: true,
  })
  @IsNotEmpty()
  @Expose({ name: 'drops' })
  @ValidateNested({ each: true })
  @Type(() => DropData)
  @IsArray()
  @ArrayMinSize(1)
  drops: DropData[];
}
