// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "forge-std/Test.sol";
import "../src/WalletImpl.sol";
import "../src/WalletFactory.sol";
import "../src/Counter.sol";
import "../src/utils/WalletTestUtils.sol";

contract WalletTest is Test {
    Wallet public wallet_blueprint;
    WalletFactory public wallet_factory;
    WalletTestUtils public wallet_utils;
    uint256 internal alicePrivateKey;
    address internal alice;

    function setUp() public {
        // Deploy a wallet (for blueprint and testing)
        wallet_blueprint = new Wallet();
        // Deploy the factory to deploy proxies
        wallet_factory = new WalletFactory(address(wallet_blueprint));
        // Deploy a utils contract for testing
        wallet_utils = new WalletTestUtils();
        // Make a wallet for Alice
        alicePrivateKey = 0xA11CE;
        alice = vm.addr(alicePrivateKey);
    }

    // Make sure that the computed address and deployed address are the same
    // function testAddressCompute(bytes32 _salt) public {
    //     // Setup //
    //     // Get the compute address
    //     address addr1 = wallet_factory.calcWalletAddress(_salt, address(0));
    //     // Get the deploy address 
    //     address addr2 = wallet_factory.createWallet(_salt, address(0));
    //     // End of setup // 

    //     // Verify //
    //     assertEq(addr1, addr2);
    //     // End of test //
    // }

    // function testFuzzingSignatureRecovery(string memory _msg) public {
    //     // SIGN // 
    //     // Hash the message
    //     bytes32 msg_hash = keccak256(abi.encode(_msg));
    //     // Use the eth_sign format //
    //     bytes32 eth_hash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", keccak256(abi.encode(_msg))));
    //     // Sign with Alice's pkey
    //     (uint8 v, bytes32 r, bytes32 s) = vm.sign(alicePrivateKey, eth_hash);
    //     // Convert her sig into bytes
    //     bytes memory signature = abi.encodePacked(r, s, v);
    //     // END OF SIGNING // 

    //     // VERIFY // 
    //     // check that the signer is indeed Alice
    //     address signer = (wallet_utils).recoverAddr(msg_hash, signature);
    //     assertEq(alice, signer);
    //     // END OF TEST
    // }

    // // Transaction test just makes sure that a Transaction object's fields can be used to call an external contract
    // function testContractCall() public {
    //     // SETUP //
    //     // The contract to interact with
    //     Counter counter = new Counter(); 
    //     // END OF SETUP //

    //     // EXECUTE //
    //     assertEq(counter.getCount(), 0);
    //     Transaction memory transaction = Transaction(3000000, address(counter), true, 0, abi.encodeWithSignature("increment()"));
    //     bool success;
    //     bytes memory result;

    //     (success, result) = transaction.target.call{value: transaction.value, 
    //                         gas: transaction.gasLimit == 0 ? gasleft() : 
    //                         transaction.gasLimit}(transaction.data);
    //     // END OF EXECUTE //

    //     // VERIFY
    //     assertTrue(success);
    //     // Make sure that the value changed
    //     assertEq(counter.getCount(), 2);
    //     // END OF TEST //
    // }

    // Test ownership TLDR: Check if the created wallet is properly initializing the gg wallet
    // function testFuzzingOwnershipInit(address _addr) public {
    //     // CREATE WALLET //
    //     bytes32 _salt = keccak256("RANDOM_S@LTY");
    //     address random_wallet_proxy = wallet_factory.createWallet(_salt, _addr);
    //     // END OF CREATION //

    //     // EXECUTE A TRANSACTION with ONLYOWNER modifier // 
    //     bool success;
    //     bytes memory result;

    //     (success, result) = (random_wallet_proxy).call{value: 0, 
    //                         gas: 3000000}(abi.encodeWithSignature("isOwner(address)", _addr));
    //     // END OF EXECUTE

    //     // VERIFY SUCCESS //
    //     assertTrue(success);
    //     // check that they are actually the owner 
    //     bool value = abi.decode(result, (bool));
    //     assertTrue(value);
    //     // END OF TEST //
    // }

    // Test full flow for a single execute call from wallet creation to signing passing the signature and then executing
    function testSingleContractCallSigned() public {
        // SETUP //
        // The contract to interact with
        Counter counter = new Counter(); 
        // Transaction nonce
        uint256 nonce = 10;
        // Wallet salt
        bytes32 _salt = keccak256("RANDOM_S@LT");
        // Create our transaction
        Transaction memory transaction = Transaction(1000000, 0, nonce, address(counter), false, abi.encodeWithSignature("increment()"));
        // Create a gg wallet for alice at address alice_ggwallet
        address alice_ggwallet = wallet_factory.createWallet(_salt, alice);
        // END OF SETUP //

        // SIGNING //
        // alice signs transaction hash
        bytes32 msg_hash = wallet_utils.encodeTransaction(transaction, nonce);
        bytes32 eth_hash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", msg_hash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(alicePrivateKey, eth_hash);
        bytes memory alice_signature = abi.encodePacked(r, s, v);
        // Make sure it is alice's signature
        assertEq(alice, (wallet_utils).recoverAddr(msg_hash, alice_signature));
        // END OF SIGNING //

        // EXECUTE TRANSACTION // 
        // new user comes in with lots of ether and alice's signature
        vm.startPrank(0x61c66721D9094DA3ceCED0F2C52c36c3AE94A319);
        vm.deal(0x61c66721D9094DA3ceCED0F2C52c36c3AE94A319, 3000000 ether);

        // make sure the counter is on its default value
        assertEq(counter.getCount(), 0);
    
        //Perform alice_ggwallet::execute(transaction, nonce, alice_signature);
        bool success;
        bytes memory result;
        
        (success, result) = (alice_ggwallet).call{value: 0, 
                            gas: 3000000}(abi.encodeWithSignature("execute((uint256,uint256,uint256,address,bool,bytes),bytes)",
                            transaction, alice_signature));
        // END OF EXECUTE // 

        // CHECK SUCCESS //
        assertTrue(success);
        // check if the counter got updated
        assertEq(counter.getCount(), 2);
        // END OF TEST // 
        vm.stopPrank();
    }
}
