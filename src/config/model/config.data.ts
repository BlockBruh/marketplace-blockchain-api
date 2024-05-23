import { ContractInterface } from 'ethers';

export interface AbisConfig {
  prjDiamond: AbiJson;
  prjContractAbi: AbiJson;
  marketplaceContractAbi: AbiJson;
  marketplaceV2ContractAbi: AbiJson;
  nativeMetaTransactionAbi: AbiJson;
  erc20Abi: AbiJson;
}

export interface AbiJson {
  abi: ContractInterface;
  contractName: string;
}

export interface AzureConfig {
  vaultUrl: string;
  secretName: string;
}

export interface EncryptionConfig {
  nonce: string;
  password: string;
  salt: string;
}

export interface RedisConfig {
  host: string;
  port: number;
  password: string;
  isTls: boolean;
}

export interface RedisKeys {
  nonceKey: string;
  hashmapKey: string;
}

export interface ContractsConfig {
  diamondAddress: string;
  wethAddress: string;
}
