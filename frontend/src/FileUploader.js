import React, { useState } from "react";
import { ethers } from "ethers";
import ABI from "./ContractABI.json";

const provider = new ethers.providers.JsonRpcProvider(
  "https://rpc.ankr.com/polygon_mumbai"
);
const contract = new ethers.Contract(
  "0x6a11a7f744c733fd6d8c927947aad0b25745e327",
  ABI,
  provider
);

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
    </div>
  );
};

export default FileUploader;
