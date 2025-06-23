// File: UploadPhoto.jsx
import React, { useState } from "react";
import axios from "axios";

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "YOUR_UPLOAD_PRESET"); // set in Cloudinary
    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
        formData
      );
      setUrl(res.data.secure_url);
      // send res.data.secure_url to your backend to save in MongoDB
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload</button>
      {url && <img src={url} alt="Uploaded preview" width="200" />}
    </div>
  );
}

export default ImageUpload;
