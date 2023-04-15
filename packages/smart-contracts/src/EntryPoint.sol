// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./utils/Transaction.sol";

// The Executor contract is designed to be the entry point for sending a bundle of transactions.
// The entire wallet logic will be encompassed here
// Inspired by the ERC-4337 spec's entry point contract
contract EntryPoint {
    function executeTransactions(contractTransaction[] calldata ctxns) external {
        bool success;
        for(uint256 i = 0; i < ctxns.length; ++i) {
            Transaction[] calldata txns = ctxns[i].transactions;
            if(txns.length > 1) {
                (success, ) = (ctxns[i].target).call(abi.encodeWithSignature(
                                                    "execute(Transaction[] calldata, bytes memory)", txns, ctxns[i].signature));
            } else {
                (success, ) = (ctxns[i].target).call(abi.encodeWithSignature(
                                                    "execute(Transaction calldata, bytes memory)", txns[0], ctxns[i].signature));
            }
        }
    }
}