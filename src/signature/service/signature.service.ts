import { Injectable, Logger } from '@nestjs/common';
import { Web3Service } from '../../web3/service/web3.service';
import { WalletService } from '../../wallet/service/wallet.service';
import {
  buildEip712Domain,
  buildSplitsForSigning,
  dropDataSchema,
  generateNonceForSplits,
  mintDataSchema,
  mintsSchema,
  paymentSchema,
  splitsSchema,
} from '../util/signature.utils';
import {
  MintsSignatureResponse,
  SplitSignatureResponse,
} from '../dto/outbound.interface';
import { MintDataDTO, SplitDataDTO } from '../dto/inbound.interface';
import { SignatureException } from '../../util/exception/signature.exception';

@Injectable()
export class SignatureService {
  private readonly logger = new Logger(SignatureService.name);

  constructor(
    private readonly web3: Web3Service,
    private walletService: WalletService,
  ) {
    this.logger.debug(`Initialized`);
  }

  async signSplits(splitsData: SplitDataDTO): Promise<SplitSignatureResponse> {
    if (!(await this.verifyChainId(splitsData.chain_id))) {
      throw new SignatureException(
        'Mismatch between request chain id and blockchain chain id.',
      );
    }
    const nonce = generateNonceForSplits(splitsData);
    const domain = buildEip712Domain(splitsData.chain_id);
    const types = {
      Splits: splitsSchema,
      Payment: paymentSchema,
    };
    const value = buildSplitsForSigning(splitsData, nonce);
    const signature = await this.walletService.signTypedData(
      domain,
      types,
      value,
    );
    return {
      signature,
      nonce,
    };
  }

  async verifyChainId(requestChainId: number) {
    return (
      (await this.web3.getChainId()).toString() === requestChainId.toString()
    );
  }

  async signMints(mints: MintDataDTO[]): Promise<MintsSignatureResponse> {
    const domain = buildEip712Domain(await this.web3.getChainId());
    const types = {
      Mints: mintsSchema,
      DropData: dropDataSchema,
      MintData: mintDataSchema,
    };
    const signature = await this.walletService.signTypedData(domain, types, {
      mints,
    });
    return {
      signature,
    };
  }
}
