// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
interface IFactory {
    //FIXME: Add eoa => scw address mapping
    // check if a wallet is deployed by the factory
    function walletsDeployed(address walletAddr) external returns(bool);

    // deploy wallet. if there is a contract at the address already then revert.
    function createWallet(bytes32 _salt, address _EOA) external returns(address);

    // get the address the wallet will be depolyed at
    function calcWalletAddress(bytes32 _salt, address _EOA) external view returns(address);
}