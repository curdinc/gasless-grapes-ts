// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "./WalletBeacon.sol";
import "./WalletImpl.sol";

contract WalletFactory {
    // Events
    event WalletCreated(address indexed eoa, address indexed contract_addr);

    // Wallet Mapping
    mapping(address => bool) public walletsDeployed;

    // State vars
    uint public count = 0;
    WalletBeacon immutable beacon;
    
    constructor(address _initalImplementation) {
        // Deploy the Beacon so that we can create proxies
        beacon = new WalletBeacon(_initalImplementation);
    }

    function getBytecode(address _EOA) public view returns (bytes memory) {
        bytes memory bytecode = type(BeaconProxy).creationCode;

        return abi.encodePacked(bytecode, abi.encode(address(beacon), abi.encodeCall(Wallet.initialize, _EOA)));
    }

    function createWallet(bytes32 _salt, address _EOA) external returns(address) {
        BeaconProxy walletProxy = new BeaconProxy{salt: _salt}(address(beacon), abi.encodeCall(Wallet.initialize, _EOA));
        // Wallet was successfully created
        walletsDeployed[address(walletProxy)] = true;
        ++count;
        emit WalletCreated(_EOA, address(walletProxy));
        return address(walletProxy);
    }

    function calcWalletAddress(bytes32 _salt, address _EOA) external view returns(address) {
        bytes32 hash = keccak256(abi.encodePacked(bytes1(0xff), address(this), _salt, keccak256(getBytecode(_EOA))));
        return address(uint160(uint(hash)));
    }

    function getBeaconAddress() public view returns(address) {
        return address(beacon);
    }

    function getImplementation() public view returns(address) {
        return beacon.implementation();
    }
}