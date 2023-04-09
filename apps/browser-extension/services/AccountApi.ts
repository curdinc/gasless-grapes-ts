// Account API
// used to invoke sign transactions?
// requires: sign function with eoa
// get scw Address?
// requires: chain
// estimate Gas: will be done by gg

import { getTransactionHash } from "./signingUtils";
import type { Transaction, signFunction } from "./types";
import { Address } from "./zodSchema";

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
    const parsed = Address.safeParse(params.eoa);
    if (!parsed.success) throw new Error("Invalid EOA");
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
