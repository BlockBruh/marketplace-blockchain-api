import { BigNumber } from 'ethers';

export class NonceData {
  public nonce: BigNumber;
  public cachedNonce: BigNumber;

  constructor(nonce: BigNumber, cachedNonce: BigNumber) {
    this.nonce = nonce;
    this.cachedNonce = cachedNonce;
  }
}
