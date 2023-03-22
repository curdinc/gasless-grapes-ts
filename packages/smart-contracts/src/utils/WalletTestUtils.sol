pragma solidity ^0.8.17;
import {Transaction} from "../../src/WalletImpl.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract WalletTestUtils {
    using ECDSA for bytes32;

    constructor() {
        INITIAL_CHAIN_ID = block.chainid;
        INITIAL_DOMAIN_SEPARATOR = _computeDomainSeparator();
    }
    
    // EIP 712 separators
    uint256 internal immutable INITIAL_CHAIN_ID;

    bytes32 internal immutable INITIAL_DOMAIN_SEPARATOR;

    function DOMAIN_SEPARATOR() public view virtual returns (bytes32) {
        return block.chainid == INITIAL_CHAIN_ID ? INITIAL_DOMAIN_SEPARATOR : _computeDomainSeparator();
    }

    function _computeDomainSeparator() internal view virtual returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    keccak256("EIP712Domain(string name,uint256 chainId)"),
                    keccak256("GASLESS_GRAPES_WALLET"),
                    block.chainid
                )
            );
    }

    function encodeTransaction(Transaction calldata transaction, uint256 nonce) public view returns(bytes32) {
        bytes32 txn_hash = keccak256(abi.encode(transaction.nonce, transaction.gasLimit, transaction.target, transaction.revertOnError, transaction.value, transaction.data));
        return keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR(), txn_hash));
    }

    function _decodeEncodeSig() internal pure {
        // ENCODE
        //bytes memory signature = abi.encodePacked(r, s, v);
        
        // DECODE
        // assembly {
        //         r := mload(add(sine, 0x20))
        //         s := mload(add(sine, 0x40))
        //         v := byte(0, mload(add(sine, 0x60)))
        // }
    }

    // Verify for testing recovery
    function recoverAddr(bytes32 txn_hash, bytes memory signature) public pure returns(address) {
        // data should be encoded with contract address
        return (txn_hash.toEthSignedMessageHash()).recover(signature);
    }

}