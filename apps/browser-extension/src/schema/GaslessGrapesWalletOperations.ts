import type { BytesLike } from "ethers";

export type signFunction = (message: BytesLike) => Promise<string>;

// TODO： Convert this to a zod schema
// Define an interface for Ethereum transactions
export interface GaslessGrapesWalletOperation {
  gasLimit: bigint; // The maximum amount of gas that can be used for the transaction
  value: bigint; // The amount of Ether to be transferred with the transaction
  nonce: bigint; // A unique identifier for the sender's account
  target: string; // The address of the contract or account that will receive the transaction
  revertOnError: boolean; // Whether the transaction should revert if an error occurs
  data: string; // The data to be sent with the transaction
}
