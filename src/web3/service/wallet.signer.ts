import { Injectable } from '@nestjs/common';
import { BigNumber, ethers } from 'ethers';

@Injectable()
export class WalletSigner extends ethers.Wallet {
  // Populates all fields in a transaction, signs it and sends it to the network
  async sendTransaction(
    transaction: Deferrable<ethers.providers.TransactionRequest>,
  ): Promise<ethers.providers.TransactionResponse> {
    this._checkProvider('sendTransaction');
    const tx = await this.populateTransaction(transaction);
    const signedTx = await this.signTransaction(tx);
    const txHash = ethers.utils.keccak256(Buffer.from(signedTx));
    console.log(new Date());
    const transactionResponsePromise = this.provider.sendTransaction(signedTx);
    console.log(new Date());
    return {
      hash: txHash,
      chainId: await transaction.chainId,
      confirmations: 0,
      data: transaction.data.toString(),
      from: transaction.from.toString(),
      gasLimit: BigNumber.from(transaction.gasLimit),
      maxPriorityFeePerGas: undefined,
      nonce: Number(transaction.nonce),
      value: BigNumber.from(transaction.value),
      async wait(
        confirmations: number | undefined,
      ): Promise<ethers.providers.TransactionReceipt> {
        return (await transactionResponsePromise).wait(confirmations);
      },
    };
  }
}

type Deferrable<T> = {
  [K in keyof T]: T[K] | Promise<T[K]>;
};
