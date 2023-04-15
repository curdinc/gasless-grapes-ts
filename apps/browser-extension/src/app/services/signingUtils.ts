import { ethers } from "ethers";
import type { GaslessGrapesWalletOperation } from "~schema/GaslessGrapesWalletOperations";

// Define the EIP-712 signature and type hash
const EIP_712_PREFIX = ethers.utils.toUtf8Bytes("\x19\x01");
const EIP_712_SIG = "EIP712Domain(string name,uint256 chainId)";
export const EIP_712_TYPE_HASH: string = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes(EIP_712_SIG),
);

// Define the domain hash
export const EIP_712_DOMAIN_HASH: string = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes("GASLESS_GRAPES_WALLET"),
);

// Get the domain separator for the given chain ID
export const getEIP712DomainSeparator = (chainId: number): string => {
  return ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["bytes32", "bytes32", "uint256"],
      [EIP_712_TYPE_HASH, EIP_712_DOMAIN_HASH, chainId],
    ),
  );
};

// Get the hash of the given transaction
export const getKeccakHashForGaslessGrapesWalletOperation = (
  walletOperation: GaslessGrapesWalletOperation,
): string => {
  return ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["uint256", "uint256", "address", "bool", "uint256", "bytes"],
      [
        walletOperation.nonce,
        walletOperation.gasLimit,
        walletOperation.target,
        walletOperation.revertOnError,
        walletOperation.value,
        walletOperation.data,
      ],
    ),
  );
};

// Get the hash of the signed message for the given transaction and chain ID
export function getEip712HashForGaslessGrapesWalletOperation(
  walletOperation: GaslessGrapesWalletOperation,
  chainId: number,
): string {
  // Get the domain separator
  const domainSeparator: string = getEIP712DomainSeparator(chainId);

  // Construct the message to sign
  const message = ethers.utils.solidityPack(
    ["bytes2", "bytes32", "bytes32"],
    [
      EIP_712_PREFIX,
      domainSeparator,
      getKeccakHashForGaslessGrapesWalletOperation(walletOperation),
    ],
  );

  // Get the hash of the signed message
  const hashedMessage: string = ethers.utils.keccak256(message);
  return hashedMessage;
}
