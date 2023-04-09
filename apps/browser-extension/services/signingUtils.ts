import { ethers } from "ethers";

// Define an interface for Ethereum transactions
export interface Transaction {
  gasLimit: ethers.BigNumber; // The maximum amount of gas that can be used for the transaction
  value: ethers.BigNumber; // The amount of Ether to be transferred with the transaction
  nonce: ethers.BigNumber; // A unique identifier for the sender's account
  target: string; // The address of the contract or account that will receive the transaction
  revertOnError: boolean; // Whether the transaction should revert if an error occurs
  data: string; // The data to be sent with the transaction
}

// Define the EIP-712 signature and type hash
const EIP_712_SIG = "EIP712Domain(string name,uint256 chainId)";
export const EIP_712_TYPE_HASH: string = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes(EIP_712_SIG),
);

// Define the domain hash
export const EIP_712_DOMAIN_HASH: string = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes("GASLESS_GRAPES_WALLET"),
);

// Get the domain separator for the given chain ID
export const getDomainSeparator = (chainId: number): string => {
  return ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["bytes32", "bytes32", "uint256"] as string[],
      [EIP_712_TYPE_HASH, EIP_712_DOMAIN_HASH, chainId],
    ),
  );
};

// Get the hash of the given transaction
export const getTxnHash = (transaction: Transaction): string => {
  return ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["uint256", "uint256", "address", "bool", "uint256", "bytes"] as string[],
      [
        transaction.nonce,
        transaction.gasLimit,
        transaction.target,
        transaction.revertOnError,
        transaction.value,
        transaction.data,
      ] as string[],
    ),
  );
};

// Get the hash of the signed message for the given transaction and chain ID
export function getTransactionHash(
  transaction: Transaction,
  chainId: number,
): string {
  // Get the domain separator
  const domainSeparator: string = getDomainSeparator(chainId);

  // Construct the message to sign
  const message = ethers.utils.solidityPack(
    ["bytes2", "bytes32", "bytes32"] as string[],
    [
      ethers.utils.toUtf8Bytes("\x19\x01"),
      domainSeparator,
      getTxnHash(transaction),
    ] as string[],
  );

  // Get the hash of the signed message
  const hashedMessage: string = ethers.utils.keccak256(message);
  return hashedMessage;
}