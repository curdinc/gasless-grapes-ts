pragma solidity ^0.8.4;

import "forge-std/Script.sol";
import "../src/WalletImpl.sol";
import "../src/WalletFactory.sol";

contract WalletFactoryScript is Script {
    bytes32 _salt;
    function setUp() public {
        _salt = keccak256("Gasless_Grapes_WalletTEST");
    }

    function run() public {
        uint256 privateKey = vm.envUint('PRIVATE_KEY');
        vm.startBroadcast(privateKey);
        Wallet wallet_blueprint = new Wallet{salt: _salt}();
        // TODO: init the wallet with no owner
        WalletFactory wallet_factory = new WalletFactory{salt: _salt}(address(wallet_blueprint));
        vm.stopBroadcast();
    }
}