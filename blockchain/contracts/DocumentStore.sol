// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@opengsn/contracts/src/BaseRelayRecipient.sol";

contract DocumentStore is GSNRecipientUpgradeable, OwnableUpgradeable {
    mapping(bytes32 => bytes32) private documentHashes;
    mapping(address => uint) private nonces;

    function initialize() public initializer {
        __Ownable_init();
        __GSNRecipient_init();
    }

    function storeHash(
        bytes32 documentId,
        bytes32 documentHash,
        uint nonce,
        bytes memory signature
    ) public onlyOwner {
        require(nonces[msg.sender] == nonce, "Invalid nonce");
        bytes32 message = keccak256(
            abi.encodePacked(
                msg.sender,
                documentId,
                documentHash,
                nonce,
                address(this)
            )
        );
        bytes32 hash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", message)
        );
        address signer = recover(hash, signature);
        require(signer == msg.sender, "Invalid signature");

        require(documentHashes[documentId] == 0, "Document hash already set");
        documentHashes[documentId] = documentHash;
    }

    function verifyHash(
        bytes32 documentId,
        bytes32 documentHash
    ) public view returns (bool) {
        return documentHashes[documentId] == documentHash;
    }

    function recover(
        bytes32 hash,
        bytes memory signature
    ) internal pure returns (address) {
        bytes32 r;
        bytes32 s;
        uint8 v;

        // Check the signature length
        if (signature.length != 65) {
            return address(0);
        }

        // Divide the signature into r, s, and v variables
        assembly {
            r := mload(add(signature, 0x20))
            s := mload(add(signature, 0x40))
            v := byte(0, mload(add(signature, 0x60)))
        }

        // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
        if (v < 27) {
            v += 27;
        }

        // If the version is correct return the signer address
        if (v != 27 && v != 28) {
            return address(0);
        } else {
            return ecrecover(hash, v, r, s);
        }
    }

    function acceptRelayedCall(
        address relay,
        address from,
        bytes calldata encodedFunction,
        uint256 transactionFee,
        uint256 gasPrice,
        uint256 gasLimit,
        uint256 nonce,
        bytes calldata approvalData,
        uint256 maxPossibleCharge
    ) external view override returns (uint256, bytes memory) {
        return _approveRelayedCall();
    }

    function _preRelayedCall(
        bytes memory context
    ) internal override returns (bytes32) {}

    function _postRelayedCall(
        bytes memory context,
        bool,
        uint256 actualCharge,
        bytes32
    ) internal override {}

    function forward(
        address to,
        bytes memory data,
        bytes memory signature
    ) public {
        bytes32 hash = keccak256(abi.encodePacked(to, data));
        require(
            _isValidTransactionWithHashSignature(hash, signature),
            "Invalid signature"
        );
        (bool success, ) = to.call(data);
        require(success, "Transaction failed");
    }

    function _isValidTransactionWithHashSignature(
        bytes32 txHash,
        bytes memory signature
    ) private pure returns (bool) {
        require(signature.length == 66, "Invalid signature length");
        uint8 v = uint8(signature[0]);
        bytes32 r = _readBytes32(signature, 1);
        bytes32 s = _readBytes32(signature, 33);
        address recovered = ecrecover(txHash, v, r, s);
        return msg.sender == recovered;
    }

    function _readBytes32(
        bytes memory data,
        uint offset
    ) private pure returns (bytes32 result) {
        for (uint i = 0; i < 32; i++) {
            result |= bytes32(uint(uint8(data[offset + i])) << (8 * (31 - i)));
        }
    }
}
