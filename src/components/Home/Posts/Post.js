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
    const [selectedImage, setSelectedImage] = useState(null)
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const postRef = useRef(null);
    const fileInputRef = useRef(null);


    const postToMongo = async (content) => {
        try {
            await axios.post('http://localhost:5000/api/posts', {
                userId,
                content,
                imageUrl: uploadedImageUrl , 
            });
            setSuccess(true);
            setPostContent('');
            setSelectedImage(null);
            setUploadedImageUrl('');
            if (onPostSuccess) onPostSuccess();
            setTimeout(() => setSuccess(false), 2000);
            setPostDummyClicked(false);
            document.body.classList.remove('modal-open')
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
    const handlePost = () => {
        postContent.trim() === '' ? alert('Post content cannot be empty'): postToMongo(postContent);
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

    const handleImageSelect = (e) =>{
        const file = e.target.files[0];
        if (!file){return;}
        setSelectedImage(file);
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = axios.post('http://localhost:5000/api/upload', formData, {
                headers:{
                    'content-type': 'multipart/form-data',
                },
            });
            setUploadedImageUrl(response.data.imageUrl);
        }catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image.');
        }finally {
            setIsUploading(false);
        }
    }


    return (
        <div className="post-container">
            <input 
                type ="file"
                ref = {fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                style={{ display: 'none' }}/>
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
