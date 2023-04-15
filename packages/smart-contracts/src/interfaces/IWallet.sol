// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "../utils/Transaction.sol";
interface IWallet {
    // single exec
    function execute(Transaction calldata txns, bytes memory signature) external;

    // multi exec
    function execute(Transaction[] calldata txns, bytes memory signature) external;
}