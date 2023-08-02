// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract DocumentStore {
    mapping(uint256 => bytes32) private documentHashes;

    function storeHash(uint256 documentId, bytes32 documentHash) external {
        require(documentHashes[documentId] == 0, "Document hash already set");
        documentHashes[documentId] = documentHash;
    }

    function verifyHash(
        uint256 documentId,
        bytes32 documentHash
    ) external view returns (bool) {
        return documentHashes[documentId] == documentHash;
    }
}
