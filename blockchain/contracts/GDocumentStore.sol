// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {ERC2771Context} from "@gelatonetwork/relay-context/contracts/vendor/ERC2771Context.sol";

contract DocumentStore is ERC2771Context {
    mapping(bytes32 => bytes32) private documentHashes;

    constructor()
        ERC2771Context(address(0x97015cD4C3d456997DD1C40e2a18c79108FCc412))
    {}

    modifier onlyTrustedForwarder() {
        require(
            isTrustedForwarder(msg.sender),
            "Only callable by Trusted Forwarder"
        );
        _;
    }

    function storeHash(
        bytes32 documentId,
        bytes32 documentHash
    ) external onlyTrustedForwarder {
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
