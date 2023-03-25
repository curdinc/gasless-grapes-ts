// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// UserOp struct standard
struct UserOperation {
  address sender;
  uint256 nonce;
  bytes initCode;
  bytes callData;
  uint256 callGasLimit;
  uint256 verificationGasLimit;
  uint256 preVerificationGas;
  uint256 maxFeePerGas;
  uint256 maxPriorityFeePerGas;
  bytes paymasterAndData;
  bytes signature;
}

// Transaction structure
struct Transaction {
  uint256 gasLimit;    // Maximum gas to be forwarded
  uint256 value;       // Amount of ETH to pass with the call
  uint256 nonce;       // Nonce for the transaction
  address target;      // Address of the contract to call
  bool revertOnError;  // Revert entire transaction if fail
  bytes data;          // calldata to pass
}

struct contractTransaction {
  address target;
  bytes signature;
  Transaction[] transactions;
}

library TransactionLib {
  function getHash(Transaction calldata transaction) pure internal returns(bytes32) {
    return keccak256(abi.encode(transaction.nonce, transaction.gasLimit, transaction.target, transaction.revertOnError, transaction.value, transaction.data));
  }
}