import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './GroupPost.css'; 

// PostTextarea component (inline) - WITH ENTER KEY
function PostTextarea({ value, onChange, placeholder, onEnterPress }) {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onEnterPress();
        }
    };

    return (
        <textarea
            autoFocus={true}
            className="post-textarea"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
        />
    );
}

// StatusMessage component (inline)
function StatusMessage({ success }) {
    if (!success) return null;
    
    return (
        <div style={{ color: 'green', margin: '10px 0' }}>
            Post shared successfully!
        </div>
    );
}

// PostButtons component (inline) - REMOVE EMOJI
function PostButtons({ onPost, onUpload }) {
    return (
        <div className="post-buttons">
            <button onClick={onUpload} className="upload-button">
                Photo
            </button>
            <button onClick={onPost} className="post-button">
                Share
            </button>
        </div>
    );
}

export default function GroupPost({ groupId, onPostSuccess }) {
    const userId = localStorage.getItem('userId');
    console.log('Current userId from localStorage:', userId); // ADD THIS LINE

    const [postContent, setPostContent] = useState('');
    const [success, setSuccess] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef(null);

    const postToMongo = async (content) => {
    // Check if userId exists
    if (!userId) {
        alert('Please log in to post');
        return;
    }
    
    console.log('Posting with data:', {
        userId,
        content,
        imageUrl: uploadedImageUrl,
        groupId
    });
    
    try {
        await axios.post(`http://localhost:5000/api/groups/${groupId}/posts`, {
            userId,
            content,
            imageUrl: uploadedImageUrl || null,
        });
        setSuccess(true);
        setPostContent('');
        setSelectedImage(null);
        setUploadedImageUrl('');
        if (onPostSuccess) onPostSuccess();
        setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
        console.error('Error posting to group:', error.response?.data || error);
        alert(error.response?.data?.message || 'Failed to post. Please try again later.');
    }
};

    const handlePost = () => {
        postContent.trim() === '' ? alert('Post content cannot be empty') : postToMongo(postContent);
    };

    const chooseImage = () => {
        fileInputRef.current?.click();
    }

    const handleImageSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedImage(file);
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'content-type': 'multipart/form-data',
                },
            });
            
            if (response.data.success && response.data.url) {
                setUploadedImageUrl(response.data.url);
                console.log('Image uploaded successfully:', response.data.url);
            } else {
                throw new Error('Upload response missing URL');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image.');
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="group-post-container">
            <div className="group-post-header">
                <h3>Share with the group</h3>
            </div>
            
            <input 
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                style={{ display: 'none' }}
            />
            
            <PostTextarea
                placeholder="What would you like to share with the group?"
                value={postContent}
                onChange={setPostContent}
                onEnterPress={handlePost}
            />

            {isUploading && (
                <div style={{margin: '10px 0', color: '#2563eb'}}> 
                    Uploading image...
                </div>   
            )}

            {uploadedImageUrl && (
                <div style={{ margin: '10px 0' }}>
                    <img 
                        src={uploadedImageUrl} 
                        alt="Uploaded" 
                        style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' }}
                    />
                </div>
            )}

            {selectedImage && (
                <div style={{ margin: '10px 0', color: '#3289e5' }}>
                    Selected: {selectedImage.name}
                </div>
            )}
            
            <div>
                <PostButtons onPost={handlePost} onUpload={chooseImage} />
            </div>
            <StatusMessage success={success} />
        </div>
    );
}