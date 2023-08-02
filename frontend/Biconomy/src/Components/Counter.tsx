import React, { useState, useEffect } from "react";
import { BiconomySmartAccount } from "@biconomy/account";
import {
  IHybridPaymaster,
  SponsorUserOperationDto,
  PaymasterMode,
} from "@biconomy/paymaster";
import abi from "../utils/counterAbi.json";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Props {
  smartAccount: BiconomySmartAccount;
  provider: any;
}

const Counter: React.FC<Props> = ({ smartAccount, provider }) => {
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<string>("");

  const counterAddress = "0xB79Ab078F221B6c5f7151A90c1f7E8eFe82c183C";

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files ? event.target.files[0] : null);
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
  return (
    <>
      <input type="file" onChange={onFileChange} />
      <br></br>
      <button onClick={onFileUpload}>Generate Hash</button>
      <br></br>
      <div>Hash: {hash}</div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default Counter;
