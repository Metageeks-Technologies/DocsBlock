import React, { useState } from "react";
import { ethers } from "ethers";
import ABI from "./ContractABI.json";
import {
  GelatoRelay,
  SponsoredCallERC2771Request,
} from "@gelatonetwork/relay-sdk";

const provider = new ethers.providers.JsonRpcProvider(
  "https://rpc.ankr.com/polygon_mumbai"
);
const DocStore = "0xd37A0ee8BDB7B9A505a5b0041977CBA7dEEe173d";
const contract = new ethers.Contract(DocStore, ABI, provider);

const relay = new GelatoRelay();
const apiKey = "3jRwo_T6VJZxOARuEYX_0irqBE_eLZyZ5qg_RDXLbXM_";

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState("");
  const [documentId, setDocumentId] = useState(0);
  const [verificationResult, setVerificationResult] = useState(null);

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const onFileUpload = async () => {
    if (!file) return;
    const fileBuffer = await file.arrayBuffer();
    const digest = await window.crypto.subtle.digest("SHA-256", fileBuffer);
    const hashArray = Array.from(new Uint8Array(digest));
    const hashHex =
      "0x" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    setHash(hashHex);
  };

  const onVerifyHash = async () => {
    if (!hash || documentId === null) return;
    const result = await contract.verifyHash(documentId, hash);
    setVerificationResult(result);
  };

  const onStoreHash = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider2 = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider2.getSigner();
    const user = signer.getAddress();
    const contract2 = new ethers.Contract(DocStore, ABI, signer);
    const { data } = await contract2.populateTransaction.storeHash(
      documentId,
      hash
    );

    const network = await provider2.getNetwork();

    const request = {
      chainId: network.chainId,
      target: DocStore,
      data: data,
      user: user,
    };

    const relayResponse = await relay.sponsoredCallERC2771(
      request,
      provider2,
      apiKey
    );
    console.log(relayResponse);
  };

  return (
    <div>
      <input type="file" onChange={onFileChange} />
      <button onClick={onFileUpload}>Generate Hash</button>
      {hash && (
        <div>
          <h2>SHA-256 Hash:</h2>
          <p>{hash}</p>
        </div>
      )}
      <input
        type="number"
        value={documentId}
        onChange={(e) => setDocumentId(e.target.value)}
        placeholder="Enter Document ID"
      />
      <button onClick={onVerifyHash}>Verify Hash</button>
      {verificationResult !== null && (
        <div>
          <h2>Verification Result:</h2>
          <p>{verificationResult ? "REAL" : "FAKE"}</p>
        </div>
      )}
      <button onClick={onStoreHash}>Store Hash</button>
    </div>
  );
};

export default FileUploader;
