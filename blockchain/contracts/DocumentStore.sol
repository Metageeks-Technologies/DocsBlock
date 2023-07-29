// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@gelatonetwork/relay-context/contracts/vendor/ERC2771Context.sol";

contract DocumentStore is ERC2771Context {
    mapping(bytes32 => bytes32) private documentHashes;

    constructor(address _trustedForwarder) ERC2771Context(_trustedForwarder) {}

    function storeHash(bytes32 documentId, bytes32 documentHash) public {
        require(documentHashes[documentId] == 0, "Document hash already set");
        documentHashes[documentId] = documentHash;
    }

    function verifyHash(
        bytes32 documentId,
        bytes32 documentHash
    ) public view returns (bool) {
        return documentHashes[documentId] == documentHash;
    }
}
