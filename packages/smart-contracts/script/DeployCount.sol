pragma solidity ^0.8.4;

import "forge-std/Script.sol";
import "../src/Counter.sol";

contract WalletFactoryScript is Script {
    function setUp() public {}

    function run() public {
        uint256 privateKey = vm.envUint('PRIVATE_KEY');
        vm.startBroadcast(privateKey);
        new Counter();
        vm.stopBroadcast();
    }
}