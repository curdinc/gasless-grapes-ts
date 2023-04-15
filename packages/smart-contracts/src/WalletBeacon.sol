// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WalletBeacon is Ownable {
    UpgradeableBeacon immutable beacon;
    address public implementation;

    constructor(address _implementation) {
        beacon = new UpgradeableBeacon(_implementation);
        implementation = _implementation;
        transferOwnership(tx.origin);
    }

    function update(address _implementation) external onlyOwner {
        beacon.upgradeTo(_implementation);
        implementation = _implementation;
    }
}