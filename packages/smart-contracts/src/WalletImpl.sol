// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@account-abstraction/samples/SimpleAccount.sol";
import "ExcessivelySafeCall/ExcessivelySafeCall.sol";
import "./utils/Transaction.sol";

contract Wallet is AccessControl, Initializable {
    using TransactionLib for Transaction;
    using ECDSA for bytes32;

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event TxnExecuted(bytes32 transaction);

    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/

    error InvalidSignature(); // Signature does not match an owner
    
    error TxnReverted(bytes32 txn_hash); // Transaction had an error

    error Unauthorised(); // msg.sender is not an owner

    error InvalidNonce(uint256 nonce); // nonce has already been used

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

    //TODO: must the mapping be public?
    // Execution mappings to prevent replay
    mapping(uint256 => bool) public nonces;

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
    // TODO: what do we do with requiredPrefund?
    // We plan to just be compatible so we add the function signature as described in the spec
    function validateUserOp(UserOperation calldata, uint) external pure {
        return;
    }

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
    function execute(Transaction calldata transaction, bytes memory signature) external {
        uint256 nonce = transaction.nonce;
        bytes32 txnHash = _getTxnHash(transaction);

        // check signature
        if(!_verify(txnHash, signature)) {
            revert InvalidSignature();
        }

        // check if txn was already executed
        if(nonces[nonce]) {
            revert InvalidNonce(nonce);
        }
        
        nonces[transaction.nonce] = true;
        
        bool success;
        bytes memory result;
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
    function execute(Transaction[] calldata txns, bytes memory signature) external {
        bytes memory multiTxnData;
        uint256 nonce;
        for(uint256 i = 0; i < txns.length; ++i) {
            nonce = txns[i].nonce;
            bytes32 txnHash = _getTxnHash(txns[i]);
            multiTxnData = abi.encode(multiTxnData, txnHash);

            // check nonce
            if(nonces[nonce]) {
                revert InvalidNonce(nonce);
            }
            nonces[nonce] = true;
        }
        bytes32 multiTxnHash = keccak256(multiTxnData);

        // check signature
        if(!_verify(multiTxnHash, signature)) {
            revert InvalidSignature();
        }
        
        for(uint256 i = 0; i < txns.length; ++i) {
            Transaction memory transaction = txns[i];

            bool success;
            bytes memory result;
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
    function _getTxnHash(Transaction calldata transaction) internal view returns(bytes32) {
        return keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR(), transaction.getHash()));
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