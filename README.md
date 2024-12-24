# DocsBlock: Soulbound NFT Credential Storage on Polygon

DocsBlock is a Solidity-based smart contract solution for securely storing credentials on the Polygon blockchain by minting Soulbound NFTs. This project is designed to enable verifiable, tamper-proof credential storage and management.

## Key Features

- **Soulbound NFTs**: Credentials are minted as non-transferable Soulbound NFTs, ensuring authenticity and user ownership.
- **Polygon Blockchain**: Leveraging the scalability and cost-efficiency of Polygon.
- **Decentralized Storage**: Credentials are stored immutably on the blockchain, providing a secure and transparent solution.

## Tech Stack

- **Solidity**: Core programming language for the smart contract.
- **Polygon**: Blockchain network for deploying the smart contract.
- **Hardhat**: Development environment for testing and deploying the smart contract.
- **IPFS** (optional): For additional off-chain storage of metadata.

## Installation

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Hardhat CLI
- MetaMask or any compatible wallet

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/docsblock.git
   cd docsblock
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add your Polygon RPC URL and private key:
     ```env
     POLYGON_RPC_URL=<your_polygon_rpc_url>
     PRIVATE_KEY=<your_private_key>
     ```

4. Compile the contract:
   ```bash
   npx hardhat compile
   ```

5. Deploy the contract:
   ```bash
   npx hardhat run scripts/deploy.js --network polygon
   ```

## Usage

1. **Mint Credential**
   Use the `mintCredential` function to mint a Soulbound NFT for a specific user address with the desired credential data.

   ```javascript
   contract.mintCredential(receiverAddress, credentialData);
   ```

2. **Retrieve Credential**
   Call the `getCredential` function to retrieve the stored credentials for a specific user.

   ```javascript
   contract.getCredential(userAddress);
   ```

## Roadmap

- [ ] Integrate IPFS for off-chain metadata storage.
- [ ] Develop a frontend dApp for easier interaction.
- [ ] Add support for multiple credential types.

## Contributing

We welcome contributions! Please open an issue or submit a pull request for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact

For inquiries, please contact the maintainer:

- **Email**: hello@metageeks.tech
