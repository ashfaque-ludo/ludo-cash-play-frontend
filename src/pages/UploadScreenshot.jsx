import React, { useState } from "react";
import axios from "axios";

export default function UploadScreenshot() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!image) return alert("Select image");

    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);

      const res = await axios.post(
        process.env.REACT_APP_BACKEND_URL + "/api/upload",
        formData
      );

      setMsg("Upload Successful");
      console.log(res.data);
    } catch (err) {
      console.log(err);
      setMsg("Upload Failed");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        background: "#0f172a",
        minHeight: "100vh",
        color: "white",
        padding: 20,
      }}
    >
      <h1>Screenshot Upload</h1>

      <input type="file" onChange={handleImage} />

      {preview && (
        <img
          src={preview}
          alt=""
          style={{
            width: 250,
            marginTop: 20,
            borderRadius: 10,
          }}
        />
      )}

      <br />

      <button
        onClick={uploadImage}
        style={{
          marginTop: 20,
          padding: "12px 25px",
          border: "none",
          borderRadius: 10,
          background: "#7c3aed",
          color: "white",
          fontWeight: "bold",
        }}
      >
        {loading ? "Uploading..." : "Upload Screenshot"}
      </button>

      <p>{msg}</p>
    </div>
  );
}
