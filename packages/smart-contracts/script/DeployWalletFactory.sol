pragma solidity ^0.8.4;

import "forge-std/Script.sol";
import "../src/WalletImpl.sol";
import "../src/WalletFactory.sol";
import "../src/EntryPoint.sol";

contract WalletFactoryScript is Script {
    function run() public {
        uint256 privateKey = vm.envUint('PRIVATE_KEY');
        vm.startBroadcast(privateKey);
        Wallet wallet_blueprint = new Wallet();
        // initialize blueprint wallet
        wallet_blueprint.initialize(address(0));

        WalletFactory wallet_factory = new WalletFactory(address(wallet_blueprint));
        EntryPoint epc = new EntryPoint();
        (epc, wallet_factory); // ignore unused parameter
        vm.stopBroadcast();
    }
}