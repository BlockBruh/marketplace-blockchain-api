import { Injectable, Logger } from '@nestjs/common';
import { SecretClient } from '@azure/keyvault-secrets';
import { configService } from '../../config/config.service';
import { DefaultAzureCredential } from '@azure/identity';
import { pbkdf2Sync } from 'pbkdf2';
import {
  crypto_secretbox_MACBYTES,
  crypto_secretbox_open_easy,
} from 'sodium-javascript';

@Injectable()
export class VaultService {
  private readonly logger = new Logger(VaultService.name);
  private readonly secretClient: SecretClient;

  constructor() {
    this.secretClient = new SecretClient(
      configService.getAzureConfig().vaultUrl,
      new DefaultAzureCredential(),
    );
    this.logger.debug(`Initialized`);
  }

  async getMnemonic(): Promise<string> {
    const mnemonicSecret = await this.secretClient.getSecret(
      configService.getAzureConfig().secretName,
    );
    return this.decryptMnemonic(mnemonicSecret.value);
  }

  private decryptMnemonic(encryptedMnemonic): string {
    const encryptConfig = configService.getEncryptionConfig();
    const generatedKey = pbkdf2Sync(
      encryptConfig.password,
      encryptConfig.salt,
      100000,
      32,
      'sha512',
    );
    const key = Buffer.from(generatedKey);
    const nonce = Buffer.from(encryptConfig.nonce);
    const cypher = Buffer.from(encryptedMnemonic, 'hex');
    const plainText = Buffer.alloc(cypher.length - crypto_secretbox_MACBYTES);
    crypto_secretbox_open_easy(plainText, cypher, nonce, key);
    return plainText.toString();
  }
}
