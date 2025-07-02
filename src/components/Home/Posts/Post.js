import { useState,useEffect,useRef } from 'react';
import axios from 'axios';
import './Post.css'; 
import PostTextarea from './PostTextarea';
import StatusMessage from './StatusMessage';
import PostButtons from './PostButtons';


export default function Post({ onPostSuccess ,setPostDummyClicked}) {
    const userId = localStorage.getItem('userId');
    const [postContent, setPostContent] = useState('');
    const [success, setSuccess] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    // const postRef = useRef(null);
    const fileInputRef = useRef(null);


    const postToMongo = async (content, imageUrls) => {
        try {
            await axios.post('http://localhost:5000/api/posts', {
                userId,
                content,
                imageUrls: imageUrls || [],
            });
            setSuccess(true);
            setPostContent('');
            setSelectedFiles([]);
            if (onPostSuccess) onPostSuccess();
            setTimeout(() => setSuccess(false), 2000);
            setPostDummyClicked(false);
   
        } catch (error) {
            console.error('Error posting:', error);
            alert('Failed to post. Please try again later.');
        }
    };

        
// the useEffect below is used to disable the scroll when the modal is open
    useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
        document.body.style.overflow = 'auto';
    };
    }, []);


    //trimming and checking if the post content is empty
    const handlePost = async () => {
        if (postContent.trim() === '') {
            alert('Post content cannot be empty');
            return;
        }
        setIsUploading(true);
        let fileUrls = [];
        try {
            if (selectedFiles.length > 0) {
                for (let file of selectedFiles) {
                    const formData = new FormData();
                    formData.append('file', file);
                    const response = await axios.post('http://localhost:5000/api/upload', formData, {
                        headers: {
                            'content-type': 'multipart/form-data',
                        },
                    });
                    if (response.data.success && response.data.url) {
                        fileUrls.push(response.data.url);
                    } else {
                        throw new Error('Upload response missing URL');
                    }
                }
            }
            await postToMongo(postContent, fileUrls);
        } catch (error) {
            console.error('Error posting:', error);
            alert('Failed to post. Please try again later.');
        } finally {
            setIsUploading(false);
        }
    };


    //i made the logic of exiting in the Modal.js file
    // useEffect(() => {
    //     const handleClickOutside = (e) => {
    //         if (postRef.current && postRef.current.contains(e.target)) {
    //             setPostDummyClicked(false);
    //              document.body.style.overflow = 'auto';
    //         }
    //     };
    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     };
    // }, [setPostDummyClicked]);
 
    
    const chooseImage = () => {
        fileInputRef.current?.click();
    }

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        setSelectedFiles(files);
    };


    return (
        <div className="post-container">
            <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*,video/*"
                multiple
                style={{ display: 'none' }}
            />
            <PostTextarea
                placeholder="What's on your mind?"
                value={postContent}
                onChange={setPostContent}
            />

            {isUploading && (
                <div style={{margin: '10px 0', color: '#2563eb'}}> 
                    Uploading image...
                </div>   
            )}

            {selectedFiles.length > 0 && (
                <div
                    style={{
                        margin: '10px 0',
                        color: '#3289e5',
                        maxHeight: '220px', // adjust as needed
                        overflowY: 'auto',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        padding: '8px',
                        background: '#fafbfc',
                    }}
                >
                    {selectedFiles.map((file, idx) => (
                        <div key={idx} style={{ marginBottom: '10px' }}>
                            Selected: {file.name}
                            <br />
                            {file.type.startsWith('image/') ? (
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="Preview"
                                    style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' }}
                                />
                            ) : file.type.startsWith('video/') ? (
                                <video
                                    src={URL.createObjectURL(file)}
                                    controls
                                    style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' }}
                                />
                            ) : null}
                        </div>
                    ))}
                </div>
            )}
            
            <div>
                <PostButtons onPost={handlePost} onUpload={chooseImage} />
            </div>
            <StatusMessage success={success} />
        </div>
    );
}
