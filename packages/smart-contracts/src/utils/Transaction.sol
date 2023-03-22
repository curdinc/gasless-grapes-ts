// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

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