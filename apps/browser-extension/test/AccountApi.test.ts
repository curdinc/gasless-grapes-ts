import { describe, test } from "@jest/globals";
import { type Bytes, ethers } from "ethers";
import type { signFunction } from "~schema/GaslessGrapesWalletOperations";

import {
  AccountAPI,
  type AccountAPIParams,
} from "../src/app/services/AccountApi";

describe("AccountApi Testing", () => {
  const wallet = ethers.Wallet.createRandom();
  let sigFunction: signFunction;
  let params: AccountAPIParams;
  beforeEach(() => {
    sigFunction = (message: Bytes): Promise<string> => {
      return wallet.signMessage(message);
    };
    params = {
      getSignature: sigFunction,
      eoa: wallet.address,
      chainId: 1, // mainnet
    };
  });
  test("Invalid EOA", () => {
    const badEOAParams: AccountAPIParams = {
      getSignature: sigFunction,
      eoa: "Invalid Address",
      chainId: 1, // mainnet
    };
    expect(() => new AccountAPI(badEOAParams)).toThrow();
  });
});
