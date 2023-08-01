// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/metatx/MinimalForwarder.sol";

contract DocumentStore is ERC2771Context {
    mapping(bytes32 => bytes32) private documentHashes;

    constructor(
        MinimalForwarder forwarder
    ) ERC2771Context(address(forwarder)) {}

    function storeHash(bytes32 documentId, bytes32 documentHash) external {
        require(documentHashes[documentId] == 0, "Document hash already set");
        documentHashes[documentId] = documentHash;
    }

    function verifyHash(
        bytes32 documentId,
        bytes32 documentHash
    ) external view returns (bool) {
        return documentHashes[documentId] == documentHash;
    }
}
