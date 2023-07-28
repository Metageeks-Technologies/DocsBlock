// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DocumentStore is Ownable {
    mapping(bytes32 => bytes32) private documentHashes;
    mapping(address => uint) private nonces;

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

        if (signature.length != 65) {
            return address(0);
        }

        assembly {
            r := mload(add(signature, 0x20))
            s := mload(add(signature, 0x40))
            v := byte(0, mload(add(signature, 0x60)))
        }

        if (v < 27) {
            v += 27;
        }

        if (v != 27 && v != 28) {
            return address(0);
        } else {
            return ecrecover(hash, v, r, s);
        }
    }
}
