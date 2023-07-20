// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DocumentStore is Ownable {
    mapping(uint256 => bytes32) public documentHashes;

    function storeHash(
        uint256 documentId,
        bytes32 documentHash
    ) public onlyOwner {
        require(documentHashes[documentId] == 0, "Document hash already set");
        documentHashes[documentId] = documentHash;
    }

    function verifyHash(
        uint256 documentId,
        bytes32 documentHash
    ) public view returns (bool) {
        return documentHashes[documentId] == documentHash;
    }
}
