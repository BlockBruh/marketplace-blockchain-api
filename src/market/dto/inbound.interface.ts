import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import { BigNumber, ethers } from 'ethers';
import {
  Is20BytesHex,
  Is32BytesHex,
  Is65BytesHex,
  IsBigNumber,
  IsBinary,
} from '../../util/validator/decorators';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DropData } from '../../signature/dto/inbound.interface';

export class MintDataForBuy {
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
  drops: DropData[];
}

export class BuyNewFiat {
  @ApiPropertyOptional({
    name: 'mints_signature',
    description: 'The mint data signature',
    example:
      '0xb09c57ae39b65d20ae9cee97df83b2bc8577a0488c140461ab1f64d1d387ccbc4b30d2fbfe84fa1d2cca3dd7e004d024eaa8cd091b4c79484c9e73857c7d32941b',
  })
  @Is65BytesHex()
  @Expose({ name: 'mints_signature' })
  mintsSignature: string;

  @ApiPropertyOptional({
    name: 'mints',
    description: 'Array of mint data DTOs',
    type: MintDataForBuy,
    isArray: true,
  })
  @IsNotEmpty()
  @Expose({ name: 'mints' })
  @ValidateNested({ each: true })
  @Type(() => MintDataForBuy)
  @IsArray()
  mints: MintDataForBuy[];
}

export class SellData {
  @ApiProperty({
    name: 'seller_address',
    type: 'string',
    description: 'The address of the seller (NFT owner)',
    example: '0x4fF5DDB196A32e3dC604abD5422805ecAD22c468',
  })
  @IsNotEmpty()
  @Is20BytesHex()
  @Expose({ name: 'seller_address' })
  seller: string;

  @ApiProperty({
    name: 'nft_address',
    type: 'string',
    description: 'The address of the NFT contract',
    example: '0xD4372620822Db34672773830dAaD592cb94d75A9',
  })
  @IsNotEmpty()
  @Is20BytesHex()
  @Expose({ name: 'nft_address' })
  nftAddress: string;

  @ApiProperty({
    name: 'token_id',
    type: 'number',
    description: 'The token id',
    example: '3341',
  })
  @IsNotEmpty()
  @IsBigNumber()
  @Transform(({ value }) => BigNumber.from(value))
  @Expose({ name: 'token_id' })
  tokenId: BigNumber;

  @ApiProperty({
    name: 'sell_nonce',
    description: 'The sell data nonce',
    example:
      '0xefee05c3db9a6134ea1c5d84365149ddd01c2bae7515db49bf13c76e08e70341',
  })
  @IsNotEmpty()
  @Is32BytesHex()
  @Expose({ name: 'sell_nonce' })
  sellNonce: string;

  @ApiProperty({
    name: 'expiration_timestamp',
    type: 'number',
    description: 'The timestamp when the sale expires',
    example: '1774126099',
  })
  @IsNotEmpty()
  @IsBigNumber()
  @Transform(({ value }) => BigNumber.from(value))
  @Expose({ name: 'expiration_timestamp' })
  expirationDate: BigNumber;
}

export class SellDataV2 {
  @ApiProperty({
    name: 'seller_address',
    type: 'string',
    description: 'The address of the seller (NFT owner)',
    example: '0x4fF5DDB196A32e3dC604abD5422805ecAD22c468',
  })
  @IsNotEmpty()
  @Is20BytesHex()
  @Expose({ name: 'seller_address' })
  seller: string;

  @ApiProperty({
    name: 'nft_address',
    type: 'string',
    description: 'The address of the NFT contract',
    example: '0xD4372620822Db34672773830dAaD592cb94d75A9',
  })
  @IsNotEmpty()
  @Is20BytesHex()
  @Expose({ name: 'nft_address' })
  nftAddress: string;

  @ApiProperty({
    name: 'token_id',
    type: 'number',
    description: 'The token id',
    example: '3341',
  })
  @IsNotEmpty()
  @IsBigNumber()
  @Transform(({ value }) => BigNumber.from(value))
  @Expose({ name: 'token_id' })
  tokenId: BigNumber;

  @ApiProperty({
    name: 'sell_nonce',
    description: 'The sell data nonce',
    example:
      '0xefee05c3db9a6134ea1c5d84365149ddd01c2bae7515db49bf13c76e08e70341',
  })
  @IsNotEmpty()
  @Is32BytesHex()
  @Expose({ name: 'sell_nonce' })
  sellNonce: string;

  @ApiProperty({
    name: 'expiration_timestamp',
    type: 'number',
    description: 'The timestamp when the sale expires',
    example: '1774126099',
  })
  @IsNotEmpty()
  @IsBigNumber()
  @Transform(({ value }) => BigNumber.from(value))
  @Expose({ name: 'expiration_timestamp' })
  expirationDate: BigNumber;

  @ApiProperty({
    name: 'payment_token_address',
    type: 'string',
    description: 'The address of the token used for payment',
    example: '0xBfC465BfFd6b00E4A2920AFE09EFF7F54c7Fee78',
  })
  @IsNotEmpty()
  @Is20BytesHex()
  @Expose({ name: 'payment_token_address' })
  paymentTokenAddress: string;

  @ApiProperty({
    name: 'payment_amount',
    type: 'number',
    description: 'The amount used for verifying the payments for splits',
    example: '1000',
  })
  @IsNotEmpty()
  @IsBigNumber()
  @Transform(({ value }) => BigNumber.from(value))
  @Expose({ name: 'payment_amount' })
  paymentAmount: BigNumber;
}

export class MerkleNode {
  @ApiProperty({
    name: 'value',
    description: 'The merkle hash at this node',
    example: ethers.constants.HashZero,
  })
  @IsNotEmpty()
  @Is32BytesHex()
  @Expose({ name: 'value' })
  value: string;

  @ApiProperty({
    name: 'position',
    description: 'The position relative to the parent node 0=Left, 1=Right',
    example: '0',
  })
  @IsNotEmpty()
  @IsBinary()
  @Expose({ name: 'position' })
  position: number;
}

export class MerkleTree {
  @ApiProperty({
    name: 'root',
    description: 'The root value of this Merkle tree',
    example: ethers.constants.HashZero,
  })
  @IsNotEmpty()
  @Is32BytesHex()
  @Expose({ name: 'root' })
  root: string;

  @ApiPropertyOptional({
    name: 'proof',
    description: 'Array of Merkle nodes',
    type: MerkleNode,
    isArray: true,
  })
  @IsNotEmpty()
  @Expose({ name: 'proof' })
  @ValidateNested({ each: true })
  @Type(() => MerkleNode)
  @IsArray()
  @ArrayMinSize(0)
  proof: MerkleNode[];
}

export class BuyListedFiat {
  @ApiPropertyOptional({
    name: 'sells',
    description: 'Array of SellData to be purchased',
    type: SellData,
    isArray: true,
  })
  @IsArray()
  @IsNotEmpty()
  @Expose({ name: 'sells' })
  @ValidateNested({ each: true })
  @Type(() => SellData)
  @ArrayMinSize(1)
  sells: SellData[];

  @ApiProperty({
    name: 'seller_signatures',
    description: 'The sell data signatures',
    example: [
      '0xc0703dfecb7809e335c93efda3ef2e2360fc47dc29b07aed3c2702388b348c3724243300a5fe5b1c339db7b479d113ac41a9505ffb671386411105be81003b321b',
    ],
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @Is65BytesHex({ each: true })
  @Expose({ name: 'seller_signatures' })
  sellerSignatures: string[];

  @ApiPropertyOptional({
    name: 'merkle_trees',
    description: 'Array of proofs for each NFT',
    type: MerkleTree,
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  @Expose({ name: 'merkle_trees' })
  @ValidateNested({ each: true })
  @Type(() => MerkleTree)
  @ArrayMinSize(1)
  merkleTrees: MerkleTree[];
}

export class BuyListedFiatV2 {
  @ApiPropertyOptional({
    name: 'sells',
    description: 'Array of SellDataV2 to be purchased',
    type: SellDataV2,
    isArray: true,
  })
  @IsArray()
  @IsNotEmpty()
  @Expose({ name: 'sells' })
  @ValidateNested({ each: true })
  @Type(() => SellDataV2)
  @ArrayMinSize(1)
  sells: SellDataV2[];

  @ApiProperty({
    name: 'seller_signatures',
    description: 'The sell data signatures',
    example: [
      '0xc0703dfecb7809e335c93efda3ef2e2360fc47dc29b07aed3c2702388b348c3724243300a5fe5b1c339db7b479d113ac41a9505ffb671386411105be81003b321b',
    ],
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @Is65BytesHex({ each: true })
  @Expose({ name: 'seller_signatures' })
  sellerSignatures: string[];

  @ApiPropertyOptional({
    name: 'merkle_trees',
    description: 'Array of proofs for each NFT',
    type: MerkleTree,
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  @Expose({ name: 'merkle_trees' })
  @ValidateNested({ each: true })
  @Type(() => MerkleTree)
  @ArrayMinSize(1)
  merkleTrees: MerkleTree[];
}

export class BuyFiatDTO {
  @ApiProperty({
    name: 'buyer_address',
    type: 'string',
    description: 'The address of the buyer',
    example: '0x4fF5DDB196A32e3dC604abD5422805ecAD22c468',
  })
  @IsNotEmpty()
  @Is20BytesHex()
  @Expose({ name: 'buyer_address' })
  buyerAddress: string;

  @ApiProperty({
    name: 'external_id',
    type: 'number',
    description: 'The external id (transaction index from backend)',
    example: '123',
  })
  @IsNotEmpty()
  @IsBigNumber()
  @Transform(({ value }) => BigNumber.from(value))
  @Expose({ name: 'external_id' })
  externalId: BigNumber;

  @ApiProperty({
    name: 'new',
    type: BuyNewFiat,
    description: 'The new NFTs to be bought',
  })
  @Type(() => BuyNewFiat)
  @IsOptional()
  new?: BuyNewFiat;

  @ApiProperty({
    name: 'listed',
    type: BuyListedFiat,
    description: 'The listed NFTs to be bought',
  })
  @Type(() => BuyListedFiat)
  @IsOptional()
  listed?: BuyListedFiat;
}

export class BuyFiatDTOV2 {
  @ApiProperty({
    name: 'buyer_address',
    type: 'string',
    description: 'The address of the buyer',
    example: '0x4fF5DDB196A32e3dC604abD5422805ecAD22c468',
  })
  @IsNotEmpty()
  @Is20BytesHex()
  @Expose({ name: 'buyer_address' })
  buyerAddress: string;

  @ApiProperty({
    name: 'external_id',
    type: 'number',
    description: 'The external id (transaction index from backend)',
    example: '123',
  })
  @IsNotEmpty()
  @IsBigNumber()
  @Transform(({ value }) => BigNumber.from(value))
  @Expose({ name: 'external_id' })
  externalId: BigNumber;

  @ApiProperty({
    name: 'new',
    type: BuyNewFiat,
    description: 'The new NFTs to be bought',
  })
  @Type(() => BuyNewFiat)
  @IsOptional()
  new?: BuyNewFiat;

  @ApiProperty({
    name: 'listed',
    type: BuyListedFiatV2,
    description: 'The listed NFTs to be bought',
  })
  @Type(() => BuyListedFiatV2)
  @IsOptional()
  listed?: BuyListedFiatV2;
}

export class TokenAddressParam {
  @ApiProperty({
    name: 'tokenAddress',
    description:
      'The address of the ERC20 contract or zero address for native coins',
    example: '0xBfC465BfFd6b00E4A2920AFE09EFF7F54c7Fee78',
  })
  @IsNotEmpty()
  @Is20BytesHex()
  @Expose({ name: 'tokenAddress' })
  tokenAddress: string;
}
