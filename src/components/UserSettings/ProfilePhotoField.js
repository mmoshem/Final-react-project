import React, { useState } from "react";
import "./ProfilePhotoField.css";
import ImageUploadButton from "./ImageUploadButton";

export default function ProfilePhotoField() {
  const [previewUrl, setPreviewUrl] = useState(null);

  const handlePreviewReady = (imageUrl) => {
    console.log("תמונה נבחרה:", imageUrl);
    setPreviewUrl(imageUrl);
  };

  return (
    <div className="photo-card">
      <div className="profile-photo-container">
        <div className="profile-photo-wrapper">
          <div className="profile-photo-circle">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="preview-image"
              />
            )}
          </div>
          <ImageUploadButton onPreviewReady={handlePreviewReady} />
        </div>

        <div className="profile-photo-content">
          <h3>Profile Photo</h3>
          <p>Upload a professional photo that represents you well</p>
        </div>
      </div>
    </div>
  );
}
