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
  const [documentId, setDocumentId] = useState<string>("");
  const [verificationResult, setVerificationResult] = useState<boolean | null>(
    null
  );

  const counterAddress = "0xAB875754B7f4Cf95c3F4dbD1E703a31E5642f43D";

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

  const onDocumentIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentId(event.target.value);
  };

  const verifyHash = async () => {
    if (documentId === "" || hash === "") {
      toast.error("Please enter a documentId and generate a hash first.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    try {
      const contract = new ethers.Contract(counterAddress, abi, provider);
      const result = await contract.verifyHash(documentId, hash);
      setVerificationResult(result);
    } catch (error) {
      console.error("Error verifying hash:", error);
      toast.error("Error occurred, check the console", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const storeHash = async () => {
    if (documentId === "" || hash === "") {
      toast.error("Please enter a documentId and generate a hash first.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    try {
      const storeHashTx = new ethers.utils.Interface([
        "function storeHash(bytes16 documentId, bytes32 documentHash)",
      ]);
      const data = storeHashTx.encodeFunctionData("storeHash", [
        ethers.utils.arrayify(documentId),
        ethers.utils.arrayify(hash),
      ]);

      const tx1 = {
        to: counterAddress,
        data: data,
      };

      let partialUserOp = await smartAccount.buildUserOp([tx1]);

      const biconomyPaymaster =
        smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;

      let paymasterServiceData: SponsorUserOperationDto = {
        mode: PaymasterMode.SPONSORED,
        // optional params...
      };

      try {
        const paymasterAndDataResponse =
          await biconomyPaymaster.getPaymasterAndData(
            partialUserOp,
            paymasterServiceData
          );
        partialUserOp.paymasterAndData =
          paymasterAndDataResponse.paymasterAndData;

        const userOpResponse = await smartAccount.sendUserOp(partialUserOp);
        const transactionDetails = await userOpResponse.wait();

        console.log("Transaction Details:", transactionDetails);
        console.log("Transaction Hash:", userOpResponse.userOpHash);

        toast.success(`Transaction Hash: ${userOpResponse.userOpHash}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } catch (e) {
        console.error("Error executing transaction:", e);
        // ... handle the error if needed ...
      }
    } catch (error) {
      console.error("Error executing transaction:", error);
      toast.error("Error occurred, check the console", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <input type="file" onChange={onFileChange} />
      <br></br>
      <button style={{ marginTop: "20px" }} onClick={onFileUpload}>
        Generate Hash
      </button>
      <br></br>
      <br></br>
      <div> Hash: {hash}</div>
      <br></br>
      <input type="text" onChange={onDocumentIdChange} value={documentId} />
      <br></br>
      <br></br>
      <button style={{ marginTop: "20px" }} onClick={verifyHash}>
        Verify Hash
      </button>
      <br></br>
      {verificationResult !== null && (
        <div>
          <h2>Verification Result:</h2>
          <p>{verificationResult ? "REAL" : "FAKE"}</p>
        </div>
      )}
      <br></br>
      <button onClick={storeHash}>Store Hash</button>
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
    </div>
  );
};

export default Counter;
