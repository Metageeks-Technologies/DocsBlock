// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DocumentStore is Ownable {
    mapping(bytes16 => bytes32) private documentHashes;
    mapping(address => bool) public whitelisted;

    function whitelist(address _addr) external onlyOwner {
        whitelisted[_addr] = true;
    }

    function storeHash(bytes16 documentId, bytes32 documentHash) external {
        require(whitelisted[msg.sender], "Not whitelisted");
        require(documentHashes[documentId] == 0, "Document hash already set");
        documentHashes[documentId] = documentHash;
    }

    function verifyHash(
        bytes16 documentId,
        bytes32 documentHash
    ) external view returns (bool) {
        return documentHashes[documentId] == documentHash;
    }
}
