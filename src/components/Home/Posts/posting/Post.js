import { useState,useEffect,useRef } from 'react';
import axios from 'axios';
import './Post.css'; 
import PostTextarea from './PostTextarea';
import StatusMessage from './StatusMessage';



export default function Post({ onPostSuccess ,setPostDummyClicked}) {
    const userId = localStorage.getItem('userId');
    const [postContent, setPostContent] = useState('');
    const [success, setSuccess] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    // const postRef = useRef(null);
    const fileInputRef = useRef(null);


    const postToMongo = async (content, mediaUrls ) => {
        try {
            console.log(mediaUrls)
            await axios.post('http://localhost:5000/api/posts', {
                userId,
                content,
                mediaUrls : mediaUrls  || [],
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

    const handlePost = async () => {
    if (postContent.trim() === '') {
        alert('Post content cannot be empty');
        return;
    }
    setIsUploading(true);
    setUploadProgress(0); // Reset progress
    let fileUrls = [];
    
    try {
        if (selectedFiles.length > 0) {
            const uploadPromises = selectedFiles.map(async (file, index) => {
                const formData = new FormData();
                formData.append('file', file);
                
                const response = await axios.post('http://localhost:5000/api/upload', formData, {
                    headers: {
                        'content-type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        const fileProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        // Calculate overall progress across all files
                        const overallProgress = Math.round(((index * 100) + fileProgress) / selectedFiles.length);
                        setUploadProgress(overallProgress);
                    }
                });
                
                if (response.data.success && response.data.url) {
                    return response.data.url;
                } else {
                    throw new Error('Upload response missing URL');
                }
            });
            
            fileUrls = await Promise.all(uploadPromises);
        }
        
        await postToMongo(postContent, fileUrls);
    } catch (error) {
        console.error('Error posting:', error);
        alert('Failed to post. Please try again later.');
    } finally {
        setIsUploading(false);
        setUploadProgress(0); // Reset progress when done
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

    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        let oversizedFiles = [];
        let filteredValidFiles = [];

        files.forEach(file => {
            if (file.size <= MAX_FILE_SIZE) {
                filteredValidFiles.push(file);
            } else {
                oversizedFiles.push(file.name);
            }
        });

        if (oversizedFiles.length > 0) {
            alert(
                `The following files are too large (max 10MB) and were not added:\n` +
                oversizedFiles.join('\n')
            );
        }

        if (filteredValidFiles.length > 0) {
            setSelectedFiles(prev => {
                const existingKeys = new Set(prev.map(f => f.name + f.size + f.lastModified));
                const newUniqueFiles = filteredValidFiles.filter(
                    f => !existingKeys.has(f.name + f.size + f.lastModified)
                );
                return [...prev, ...newUniqueFiles];
            });
        }

        // Reset input so user can select the same file(s) again if needed
        fileInputRef.current.value = '';
    };
    // Remove a file from selectedFiles by index
    const handleRemoveFile = (idxToRemove) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((_, idx) => idx !== idxToRemove));
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
                    <div>Uploading {selectedFiles.length} files... {uploadProgress}%</div>
                    <div style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: '#e0e0e0',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        marginTop: '5px'
                    }}>
                        <div style={{
                            width: `${uploadProgress}%`,
                            height: '100%',
                            backgroundColor: '#2563eb',
                            transition: 'width 0.3s ease'
                        }} />
                    </div>
                </div>   
            )}


            {selectedFiles.length > 0 && (
                <div
                    style={{
                        margin: '10px 0',
                        color: '#3289e5',
                        width: '100%',
                        maxHeight: '150px', // adjust as needed
                        overflowY: 'auto',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        padding: '8px',
                        background: '#fafbfc',
                    }}
                >
                    {selectedFiles.map((file, idx) => (
                        <div key={idx} style={{ marginBottom: '10px', position: 'relative', paddingRight: '28px' }}>
                            Selected: {file.name.length > 50 ? file.name.slice(0, 50) + '...' : file.name}
                            <button
                                type="button"
                                onClick={() => handleRemoveFile(idx)}
                                className='deleteBtn'
                                title="Remove file"
                            >
                                x
                            </button>
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
                <button onClick={handlePost} className="postButton marginR"> post</button>
                <button onClick={chooseImage} className='postButton'>choose image</button>
            </div>
            <StatusMessage success={success} />
        </div>
    );
}
