import { describe, test } from "@jest/globals";
import { ethers } from "ethers";

import {
  EIP_712_DOMAIN_HASH,
  EIP_712_TYPE_HASH,
  getEIP712DomainSeparator,
  getEip712HashForGaslessGrapesWalletOperation,
  getKeccakHashForGaslessGrapesWalletOperation,
} from "../src/app/services/signingUtils";
import type { GaslessGrapesWalletOperation } from "../src/schema/GaslessGrapesWalletOperations";

describe("signing tests", () => {
  test("test typehash", () => {
    expect(EIP_712_TYPE_HASH).toBe(
      "0xcc85e4a69ca54da41cc4383bb845cbd1e15ef8a13557a6bed09b8bea2a0d92ff",
    );
  });
  test("test domainhash", () => {
    expect(EIP_712_DOMAIN_HASH).toBe(
      "0x3c924ac159c18b9abc95e27241d8d48f7303b8371d5de879bcdbc55a381559eb",
    );
  });
  test("test domainseparator", () => {
    // hardcoded chain one, crosschecked with remix
    expect(getEIP712DomainSeparator(1)).toBe(
      "0x09f0d3d6d21027515bd4d9c8f9407fd674f4924fe5485ce3fe25cb2ef1671246",
    );
  });
  test("basic hash", () => {
    const ABI = ["function increment() view"];
    const iface = new ethers.utils.Interface(ABI);
    const walletOperation: GaslessGrapesWalletOperation = {
      gasLimit: BigInt(1000000),
      value: BigInt(0),
      nonce: BigInt(12),
      target: "0x5253F42a13f14a50E8783b23a787247002e7a9eC",
      revertOnError: false,
      data: iface.encodeFunctionData("increment"),
    };
    expect(getKeccakHashForGaslessGrapesWalletOperation(walletOperation)).toBe(
      "0x7cddc12e3f1c40e3d4e7a35c3966403d2cf04ff462c29ef0259598ce96c5c15a",
    );

    expect(
      getEip712HashForGaslessGrapesWalletOperation(walletOperation, 1),
    ).toBe(
      "0x304ed2d2fbd66467f1d79e7b83b274dda80cb8fe92002b918b83c574888ddea3",
    );
  });
});
