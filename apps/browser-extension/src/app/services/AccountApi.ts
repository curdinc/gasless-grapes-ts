// Account API
// used to invoke sign transactions?
// requires: sign function with eoa
// get scw Address?
// requires: chain
// estimate Gas: will be done by gg

import type {
  GaslessGrapesWalletOperation,
  signFunction,
} from "~schema/GaslessGrapesWalletOperations";

import { EthAddressSchema } from "../../schema/EvmRequestSchema";
import { getEip712HashForGaslessGrapesWalletOperation } from "./signingUtils";

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

  async createSignedTransaction(
    walletOperation: GaslessGrapesWalletOperation,
  ): Promise<string> {
    const WalletOperationEIP712Hash =
      getEip712HashForGaslessGrapesWalletOperation(
        walletOperation,
        this.chainId,
      );
    const signedTxn = await this.getSignature(WalletOperationEIP712Hash);

    return signedTxn;
  }
}
