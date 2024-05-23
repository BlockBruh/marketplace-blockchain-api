import {
  AbiJson,
  AbisConfig,
  AzureConfig,
  ContractsConfig,
  EncryptionConfig,
  RedisConfig,
  RedisKeys,
} from './model/config.data';
import {
  ContractsConstants,
  RedisConfigConstants,
  RedisKeysConstants,
  SNPConstants,
} from './util/constants';

export class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'LOCAL';
  }

  ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  getAzureConfig(): AzureConfig {
    return {
      vaultUrl: this.getValue('AZURE_VAULT_URL'),
      secretName: this.getValue('AZURE_OPERATOR_SECRET_NAME'),
    };
  }

  getEncryptionConfig(): EncryptionConfig {
    return {
      nonce: this.getValue(SNPConstants.N),
      password: this.getValue(SNPConstants.P),
      salt: this.getValue(SNPConstants.S),
    };
  }

  getRedisConfig(): RedisConfig {
    return {
      host: `${configService.getValue(RedisConfigConstants.HOST)}`,
      port: Number.parseInt(configService.getValue(RedisConfigConstants.PORT)),
      password: `${configService.getValue(RedisConfigConstants.PASS)}`,
      isTls: configService.isProduction(),
    };
  }

  getRedisKeys(): RedisKeys {
    return {
      nonceKey: `${configService.getValue(RedisKeysConstants.NONCE_KEY)}`,
      hashmapKey: `${configService.getValue(RedisKeysConstants.HASHMAP_KEY)}`,
    };
  }

  getContractsConfig(): ContractsConfig {
    return {
      diamondAddress: this.getValue(ContractsConstants.DIAMOND_ADDRESS),
      wethAddress: this.getValue(ContractsConstants.WETH_ADDRESS),
    };
  }

  getAbisConfig(): AbisConfig {
    const networkName = this.getValue('NETWORK_NAME');
    return {
      prjDiamond:
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require(`prj-blockchain/shared/artifacts/${networkName}/prjMarketplace.json`) as AbiJson,
      prjContractAbi:
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require(`prj-blockchain/shared/artifacts/${networkName}/prjERC721.json`) as AbiJson,
      marketplaceContractAbi:
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require(`prj-blockchain/shared/artifacts/${networkName}/MarketplaceFacet.json`) as AbiJson,
      marketplaceV2ContractAbi:
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require(`prj-blockchain/shared/artifacts/${networkName}/MarketplaceFacetV2.json`) as AbiJson,
      nativeMetaTransactionAbi:
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require(`prj-blockchain/shared/artifacts/${networkName}/NativeMetaTransactionFacetV2.json`) as AbiJson,
      erc20Abi:
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require(`prj-blockchain/shared/artifacts/${networkName}/ERC20Mintable.json`) as AbiJson,
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'APPLICATIONINSIGHTS_CONNECTION_STRING',
  'AZURE_CLIENT_ID',
  'AZURE_CLIENT_SECRET',
  'AZURE_CONNECTION_STRING',
  'AZURE_OPERATOR_SECRET_NAME',
  'AZURE_TENANT_ID',
  'AZURE_VAULT_URL',
  ContractsConstants.DIAMOND_ADDRESS,
  'LOGGING_API_URL',
  'MODE',
  'NETWORK_NAME',
  'RPC_PROVIDER',
  SNPConstants.S,
  SNPConstants.N,
  SNPConstants.P,
  RedisConfigConstants.HOST,
  RedisConfigConstants.PORT,
  RedisConfigConstants.PASS,
  RedisKeysConstants.NONCE_KEY,
  RedisKeysConstants.HASHMAP_KEY,
  RedisKeysConstants.CLEANUP_INTERVAL,
]);

export { configService };
