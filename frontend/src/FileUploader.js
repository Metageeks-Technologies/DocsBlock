import React, { useState } from "react";

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState("");

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const onFileUpload = async () => {
    if (!file) return;
    const fileBuffer = await file.arrayBuffer();
    const digest = await window.crypto.subtle.digest("SHA-256", fileBuffer);
    const hashArray = Array.from(new Uint8Array(digest));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    setHash(hashHex);
  };

  return (
    <div>
      <input type="file" onChange={onFileChange} />
      <button onClick={onFileUpload}>Upload</button>
      {hash && (
        <div>
          <h2>SHA-256 Hash:</h2>
          <p>{hash}</p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
