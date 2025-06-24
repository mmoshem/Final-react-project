import { useState } from 'react';
import axios from 'axios';
export default function Post() {

    const userId = localStorage.getItem('userId');
    const [postContent, setPostContent] = useState('');
    const [success, setSuccess] = useState(false);
    
    const postToMongo = async (content) => {
        try {
            await axios.post('http://localhost:5000/api/posts', {
                userId: userId,
                content: content
            });
            setSuccess(true);
            setPostContent('');
            setTimeout(() => setSuccess(false), 2000); // Hide success after 2s
        } catch (error) {
            console.error('Error posting to MongoDB:', error);
            alert('Failed to post. Please try again later.');
        }
    };
    
    const handlePost = () => {
        if (postContent.trim() === '') {
            alert('Post content cannot be empty');
            return;
        }
        postToMongo(postContent);
        console.log('Post submitted:', postContent);
    }
    return (
        <div className="post">
            <h2>Post Component</h2>
            <input 
                type="text"
                className="post-input"
                placeholder="Write a post..."
                value={postContent}
                onChange={e => setPostContent(e.target.value)}
            />
            <button onClick={handlePost}>Post</button>
            {success && <div style={{ color: 'green', marginTop: '10px' }}>Post submitted!</div>}
        </div>
    );
}