pragma solidity ^0.8.4;

import "forge-std/Script.sol";
import "../src/WalletImpl.sol";
import "../src/WalletBeacon.sol";

contract WalletFactoryScript is Script {
    WalletBeacon wb;
    address constant WALLET_BEACON_ADDRESS = 0x19d97c634FDEaDcBA5dF5239c001fC850DEe7c93;
    
    function setUp() public {
        wb = WalletBeacon(WALLET_BEACON_ADDRESS);
    }

    function run() public {
        string memory seedPhrase = vm.readFile(".secret");
        uint256 privateKey = vm.deriveKey(seedPhrase, 0);
        vm.startBroadcast(privateKey);
        Wallet new_wallet_blueprint = new Wallet();
        wb.update(address(new_wallet_blueprint));
        vm.stopBroadcast();
    }
}