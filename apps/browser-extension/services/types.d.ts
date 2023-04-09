type signFunction = (message: Bytes) => Promise<string>;

// Define an interface for Ethereum transactions
export interface Transaction {
  gasLimit: ethers.BigNumber; // The maximum amount of gas that can be used for the transaction
  value: ethers.BigNumber; // The amount of Ether to be transferred with the transaction
  nonce: ethers.BigNumber; // A unique identifier for the sender's account
  target: string; // The address of the contract or account that will receive the transaction
  revertOnError: boolean; // Whether the transaction should revert if an error occurs
  data: string; // The data to be sent with the transaction
}
