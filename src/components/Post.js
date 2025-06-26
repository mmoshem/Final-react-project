import { useState } from 'react';
import axios from 'axios';
import './Post.css'; // Add this to apply styles

export default function Post({ onPostSuccess }) {
    const userId = localStorage.getItem('userId');
    const [postContent, setPostContent] = useState('');
    const [success, setSuccess] = useState(false);

    const postToMongo = async (content) => {
        try {
            await axios.post('http://localhost:5000/api/posts', {
                userId,
                content
            });
            setSuccess(true);
            setPostContent('');
            if (onPostSuccess) onPostSuccess();
            setTimeout(() => setSuccess(false), 2000);
        } catch (error) {
            console.error('Error posting:', error);
            alert('Failed to post. Please try again later.');
        }
    };

    const handlePost = () => {
        if (postContent.trim() === '') {
            alert('Post content cannot be empty');
            return;
        }
        postToMongo(postContent);
    };

    return (
        <div className="post-container">
            <h2>Create a Post</h2>
            <textarea
                className="post-textarea"
                placeholder="What's on your mind?"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
            />
            <button className="post-button" onClick={handlePost}>
                Post
            </button>
            {success && <div className="post-success">Post submitted!</div>}
        </div>
    );
}
