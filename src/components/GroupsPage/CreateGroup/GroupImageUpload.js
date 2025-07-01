import React, { useRef } from 'react';
import './GroupImageUpload.css';

function GroupImageUpload({ imagePreview, onImageUpload }) {
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        onImageUpload(e);
    };

    const handleChangePhoto = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="form-section">
            <label className="form-label">Group Image (Optional)</label>
            <div className="image-upload-container">
                <input
                    ref={fileInputRef}
                    type="file"
                    id="group-image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="image-input"
                />
                
                <div className="image-upload-area">
                    {imagePreview ? (
                        <div className="image-container" onClick={handleChangePhoto}>
                            <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="image-preview"
                            />
                            <div className="change-photo-overlay">
                                <span className="change-icon">📷</span>
                                <span>Change Photo</span>
                            </div>
                        </div>
                    ) : (
                        <div className="upload-placeholder" onClick={handleChangePhoto}>
                            <span className="upload-icon">📷</span>
                            <span>Click to upload group image</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GroupImageUpload;