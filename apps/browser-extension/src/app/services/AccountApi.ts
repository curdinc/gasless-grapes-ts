// Account API
// used to invoke sign transactions?
// requires: sign function with eoa
// get scw Address?
// requires: chain
// estimate Gas: will be done by gg

import type { Transaction } from "ethers";
import { EthAddressSchema } from "~schema/EvmRequestSchema";
import type { signFunction } from "~schema/GaslessGrapesWalletOperations";

import { getTransactionHash } from "./signingUtils";

export interface AccountAPIParams {
  getSignature: signFunction;
  eoa: string;
  chainId: number;
}

export class AccountAPI {
  getSignature: signFunction;
  chainId: number;
  eoa: string;

  constructor(params: AccountAPIParams) {
    EthAddressSchema.parse(params.eoa);
    this.getSignature = params.getSignature;
    this.chainId = params.chainId;
    this.eoa = params.eoa;
  }

  async createSignedTransaction(transaction: Transaction): Promise<string> {
    const txnHash = getTransactionHash(transaction, this.chainId);
    const signedTxn = await this.getSignature(txnHash);

    return signedTxn;
  }
}
