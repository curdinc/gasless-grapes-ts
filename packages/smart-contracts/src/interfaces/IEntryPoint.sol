// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "../utils/Transaction.sol";
interface IEntryPoint {
    // Execute all contractTransactions on the target scws. They can all individually revert.
    function executeTransactions(contractTransaction[] calldata ctxns) external;
}