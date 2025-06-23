import { useState } from 'react';
import axios from 'axios';
export default function Post() {

    const userId = localStorage.getItem('userId');
    const [postContent, setPostContent] = useState('');
    
    const postToMongo = async () => {
        try {
            await axios.post('http://localhost:5000/api/posts', {
                userId: userId,
                content: postContent
            });
        } catch (error) {
            console.error('Error posting to MongoDB:', error);
            alert('Failed to post. Please try again later.');
        }
    };
    
    const handlePost = () => {
        const postContent = document.querySelector('.post-input').value;
        setPostContent(postContent);
        if (postContent.trim() === '') {
            alert('Post content cannot be empty');
            return;
        }
        
        postToMongo(postContent)


        console.log('Post submitted:', postContent);
        document.querySelector('.post-input').value = ''; // Clear input after posting


    }
    return (
        <div className="post">
            <h2>Post Component</h2>
            <input type="text"className="post-input" placeholder="Write a post..." />
            <button onClick={handlePost}>Post</button>
        </div>
    );

}