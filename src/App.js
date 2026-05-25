import React, { useState } from "react";
import axios from "axios";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!image) {
      alert("Please select image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      await axios.post(
        "https://ludo-cash-play.onrender.com/api/upload",
        formData
      );

      setMessage("Upload Success");
    } catch (error) {
      console.log(error);
      setMessage("Upload Failed");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Screenshot Upload System</h1>

      <input type="file" onChange={handleChange} />

      <br /><br />

      {preview && (
        <img
          src={preview}
          alt="preview"
          width="300"
          style={{ borderRadius: "10px" }}
        />
      )}

      <br /><br />

      <button onClick={uploadImage}>
        Upload Screenshot
      </button>

      <p>{message}</p>
    </div>
  );
}

export default App;
