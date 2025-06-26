import React, { useRef } from "react";
import "./ImageUploadButton.css";

export default function ImageUploadButton({ onPreviewReady }) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onPreviewReady(imageUrl);
    }
  };


  return (
    <>
      <button className="camera-icon-button" onClick={handleClick}>
        📷
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleChange}
        style={{ display: "none" }}
      />
    </>
  );
}
