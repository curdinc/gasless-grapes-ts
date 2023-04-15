pragma solidity ^0.8.4;

import "forge-std/Script.sol";
import "../src/WalletImpl.sol";
import "../src/WalletFactory.sol";
import "../src/EntryPoint.sol";

contract WalletFactoryScript is Script {
    bytes32 _salt;
    function setUp() public {
        _salt = keccak256("Gasless_Grapes_WalletTEST");
    }

    function run() public {
        uint256 privateKey = vm.envUint('PRIVATE_KEY');
        vm.startBroadcast(privateKey);
        Wallet wallet_blueprint = new Wallet{salt: _salt}();
        // initialize blueprint wallet
        wallet_blueprint.initialize(address(0));

        WalletFactory wallet_factory = new WalletFactory{salt: _salt}(address(wallet_blueprint));
        EntryPoint epc = new EntryPoint();
        (epc, wallet_factory); // ignore unused parameter
        vm.stopBroadcast();
    }
}