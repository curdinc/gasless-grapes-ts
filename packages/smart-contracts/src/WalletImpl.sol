// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

//FIXME:
// Transaction structure
struct Transaction {
    uint256 gasLimit;    // Maximum gas to be forwarded
    address target;      // Address of the contract to call
    bool revertOnError;  // Revert entire transaction if fail
    uint256 value;       // Amount of ETH to pass with the call
    bytes data;          // calldata to pass
}

contract Wallet is AccessControl, Initializable {
    using ECDSA for bytes32;

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event TxnExecuted(bytes32 transaction);

    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/

    error InvalidSignature(); // Signature does not match an owner

    error TxnRepeated(bytes32 txn_hash); // Transaction was already executed
    
    error TxnReverted(bytes32 txn_hash); // Transaction had an error

    error Unauthorised(); // msg.sender is not an owner

    /*//////////////////////////////////////////////////////////////
                                 ROLES
    //////////////////////////////////////////////////////////////*/

    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");

    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/
    // EIP 712 separators
    uint256 internal immutable INITIAL_CHAIN_ID;

    bytes32 internal immutable INITIAL_DOMAIN_SEPARATOR;

    // Execution mappings to prevent replay
    mapping(bytes32 => bool) public executed;

    /*//////////////////////////////////////////////////////////////
                                 INITIALIZERS
    //////////////////////////////////////////////////////////////*/

    constructor() {
        INITIAL_CHAIN_ID = block.chainid;
        INITIAL_DOMAIN_SEPARATOR = _computeDomainSeparator();
    }

    // Wallet Initializer: one-time call
    function initialize(address _EOA) external initializer {
        _grantRole(OWNER_ROLE, _EOA);
    }

    /*//////////////////////////////////////////////////////////////
                                 ACCESS-CONTROL
    //////////////////////////////////////////////////////////////*/

    // Check whether an owner called a function
    modifier onlyOwner {
      if(!hasRole(OWNER_ROLE, msg.sender)) {
        revert Unauthorised();
      }
      _;
    }

    // Adding an owner 
    function addOwner(address _wallet) external onlyOwner {
        _grantRole(OWNER_ROLE, _wallet);
    }

    /*//////////////////////////////////////////////////////////////
                                 EIP-4337 LOGIC
    //////////////////////////////////////////////////////////////*/
    // TODO:
    // We plan to just be compatible so we add the function signature as described in the spec
    // function validateUserOp(UserOperation calldata userOp, uint requiredPrefund) external {
    //     return;
    // }

    /*//////////////////////////////////////////////////////////////
                                WALLET LOGIC
    //////////////////////////////////////////////////////////////*/

    // Function to receive Ether.
    receive() external payable {}

    // Verify functionality (internal)
    function _verify(bytes32 txn_hash, bytes memory signature) internal view returns(bool) {
        // data should be encoded with contract address
        return hasRole(OWNER_ROLE, (txn_hash.toEthSignedMessageHash()).recover(signature));
    }

    // Single transaction execute
    function execute(Transaction calldata transaction, uint256 nonce, bytes memory signature) external {
        bytes32 txnHash = _getTxnHash(transaction, nonce);

        // check signature
        if(!_verify(txnHash, signature)) {
            revert InvalidSignature();
        }

        // check if txn was already executed
        if(executed[txnHash]) {
            revert TxnRepeated(txnHash);
        }

        bool success;
        bytes memory result;

        executed[txnHash] = true;

        //FIXME:
        (success, result) = transaction.target.call{value: transaction.value, 
                            gas: transaction.gasLimit == 0 ? gasleft() : 
                            transaction.gasLimit}(transaction.data);
        
        if (success) {
            emit TxnExecuted(txnHash);
        } else {
            revert TxnReverted(txnHash);
        }
    }

    // Multi-execute
    function execute(Transaction[] calldata txns, uint256 nonce, bytes memory signature) external {
        bytes memory multiTxnData;
        for(uint256 i = 0; i < txns.length; ++i) {
            bytes32 txnHash = _getTxnHash(txns[i], nonce);
            multiTxnData = abi.encode(multiTxnData, txnHash);
        }
        bytes32 multiTxnHash = keccak256(multiTxnData);

        // check signature
        if(!_verify(multiTxnHash, signature)) {
            revert InvalidSignature();
        }

        // make sure that this transaction was not already executed
        if(executed[multiTxnHash]) {
            revert TxnRepeated(multiTxnHash);
        }
        executed[multiTxnHash] = true;
        
        for(uint256 i = 0; i < txns.length; ++i) {
            Transaction memory transaction = txns[i];

            bool success;
            bytes memory result;
            //FIXME:
            (success, result) = transaction.target.call{value: transaction.value, 
                                gas: transaction.gasLimit == 0 ? gasleft() : 
                                transaction.gasLimit}(transaction.data);
    
            if(!success) {
                revert TxnReverted(multiTxnHash);
            }
        }
    }

    /*//////////////////////////////////////////////////////////////
                                 EIP-712 LOGIC
    //////////////////////////////////////////////////////////////*/

    // EIP-712 typed data hash
    //FIXME:
    function _getTxnHash(Transaction calldata transaction, uint256 nonce) internal view returns(bytes32) {
        bytes32 txn_hash = keccak256(abi.encode(nonce, transaction.gasLimit, transaction.target, transaction.revertOnError, transaction.value, transaction.data));
        return keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR(), txn_hash));
    }

    // Domain separator
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

    /*//////////////////////////////////////////////////////////////
                                 EIP-1271 LOGIC
    //////////////////////////////////////////////////////////////*/

    // Verify EIP-1271 bytes32, bytes variant
    function isValidSignature(bytes32 _hash, bytes calldata _signature) external view returns (bytes4 magicValue) {
        if (_verify(_hash, _signature)) {
            return 0x1626ba7e;
        }
    }

    // Verify EIP-1271 bytes, bytes variant
    function isValidSignature(bytes calldata _data, bytes calldata _signature) external view returns (bytes4 magicValue) {
    // Validate signatures
        if (_verify(keccak256(_data), _signature)) {
            return 0x20c13b0b;
        }
    }

}