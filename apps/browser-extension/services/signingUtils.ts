import { ethers } from "ethers";

interface Transaction {
  gasLimit: number;
  value: number;
  nonce: number;
  target: string;
  revertOnError: boolean;
  data: string;
}

const EIP_712_SIG = "EIP712Domain(string name,uint256 chainId)";

const EIP_712_TYPE_HASH: string = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes(EIP_712_SIG),
);

const EIP_712_DOMAIN_HASH: string = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes("GASLESS_GRAPES_WALLET"),
);

function getTransactionHash(transaction: Transaction, chainId: number): string {
  const domainSeparator: string = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["bytes32", "string", "uint256"] as string[],
      [EIP_712_TYPE_HASH, EIP_712_DOMAIN_HASH, chainId],
    ),
  );

  //   const message = ethers.utils.keccak256(
  //     ethers.utils.solidityPack(
  //       ["bytes32", "bytes32"],
  //       [
  //         ethers.utils.keccak256(
  //           ethers.utils.toUtf8Bytes(
  //             "Transaction(uint256 gasLimit,uint256 value,uint256 nonce,address target,bool revertOnError,bytes data)",
  //           ),
  //         ),
  //         ethers.utils.keccak256(
  //           ethers.utils.defaultAbiCoder.encode(
  //             [
  //               "uint256",
  //               "uint256",
  //               "uint256",
  //               "address",
  //               "bool",
  //               "bytes",
  //             ] as string[],
  //             [
  //               transaction.gasLimit,
  //               transaction.value,
  //               transaction.nonce,
  //               transaction.target,
  //               transaction.revertOnError,
  //               transaction.data,
  //             ] as string[],
  //           ),
  //         ),
  //       ],
  //     ),
  //   );

  //   const hashedMessage: string = ethers.utils.keccak256(
  //     ethers.utils.solidityPack(
  //       ["bytes1", "bytes1", "bytes32", "bytes32"] as string[],
  //       ["0x19", "0x01", domainSeparator, message] as string[],
  //     ),
  //   );

  //return hashedMessage;
  return domainSeparator;
}

const txn: Transaction = {
  gasLimit: 2,
  value: 0,
  nonce: 1,
  target: "0x61c66721D9094DA3ceCED0F2C52c36c3AE94A319",
  revertOnError: true,
  data: "",
};
const hash = getTransactionHash(txn, 1);

console.log(hash);
