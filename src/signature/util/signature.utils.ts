import { SignatureConstants } from './constants';
import {
  BlockchainEncodeConstants,
  BlockchainSchemaConstants,
} from '../../web3/util/constants';
import { SplitDataDTO } from '../dto/inbound.interface';
import { ethers } from 'ethers';
import { SplitsData } from '../model/splits.data';

export const buildSplitsForSigning = (
  splitsData: SplitDataDTO,
  nonce: string,
): SplitsData => {
  return {
    buyer: splitsData.buyer,
    payments: splitsData.payments,
    actionExpiration: splitsData.actionExpiration,
    token: splitsData.token,
    nonce,
    tradeDataHash: getSignatureHash(
      splitsData.mintsSignature,
      splitsData.sellNonces,
    ),
  };
};

export const generateNonceForSplits = (splitsData: SplitDataDTO) => {
  const types: string[] = [
    BlockchainEncodeConstants.ADDRESS,
    BlockchainEncodeConstants.PAYMENTS,
    BlockchainEncodeConstants.UINT256,
    BlockchainEncodeConstants.ADDRESS,
    BlockchainEncodeConstants.UINT256,
    BlockchainEncodeConstants.UINT256,
    BlockchainEncodeConstants.BYTES32,
  ];
  const timestamp = Date.now();
  const values = [
    splitsData.buyer,
    splitsData.payments,
    splitsData.actionExpiration,
    splitsData.token,
    splitsData.chain_id,
    timestamp,
    getSignatureHash(splitsData.mintsSignature, splitsData.sellNonces),
  ];
  return ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(types, values),
  );
};

const getSignatureHash = (
  mintsSignature: string | undefined,
  sellNonces: string[] | undefined,
): string => {
  if (mintsSignature && sellNonces)
    return ethers.utils.keccak256(
      ethers.utils.solidityPack(
        ['bytes', 'uint256[]'],
        [mintsSignature, sellNonces],
      ),
    );
  else if (sellNonces)
    return ethers.utils.keccak256(
      ethers.utils.solidityPack(['uint256[]'], [sellNonces]),
    );
  else return ethers.utils.keccak256(mintsSignature);
};

export const buildEip712Domain = (chain_id: number) => {
  return {
    name: SignatureConstants.MARKET_DOMAIN_NAME,
    version: '1',
    chainId: chain_id,
    verifyingContract: process.env.DIAMOND_ADDRESS,
  };
};

export const splitsSchema = [
  { name: 'buyer', type: BlockchainSchemaConstants.ADDRESS },
  { name: 'payments', type: BlockchainSchemaConstants.PAYMENTS },
  { name: 'actionExpiration', type: BlockchainSchemaConstants.UINT256 },
  { name: 'nonce', type: BlockchainSchemaConstants.UINT256 },
  { name: 'token', type: BlockchainSchemaConstants.ADDRESS },
  { name: 'tradeDataHash', type: BlockchainSchemaConstants.BYTES32 },
];

export const paymentSchema = [
  { name: 'amount', type: BlockchainSchemaConstants.UINT256 },
  { name: 'recipient', type: BlockchainSchemaConstants.ADDRESS },
];

export const dropDataSchema = [
  { name: 'dropId', type: BlockchainSchemaConstants.UINT256 },
  { name: 'maxEditions', type: BlockchainSchemaConstants.UINT256 },
  { name: 'mintEditions', type: BlockchainSchemaConstants.UINT256 },
  { name: 'royaltiesPercent', type: BlockchainSchemaConstants.UINT16 },
  { name: 'creatorAddress', type: BlockchainSchemaConstants.ADDRESS },
  { name: 'tokenUri', type: BlockchainSchemaConstants.STRING },
  { name: 'utilityIds', type: BlockchainSchemaConstants.STRINGS },
];

export const mintDataSchema = [
  { name: 'nftAddress', type: BlockchainSchemaConstants.ADDRESS },
  { name: 'drops', type: BlockchainSchemaConstants.DROPS },
];

export const mintsSchema = [
  { name: 'mints', type: BlockchainSchemaConstants.MINTS },
];
