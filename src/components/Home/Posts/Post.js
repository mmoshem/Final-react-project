import { useState,useEffect,useRef } from 'react';
import axios from 'axios';
import './Post.css'; // Add this to apply styles

export default function Post({ onPostSuccess ,setPostDummyClicked}) {
    const userId = localStorage.getItem('userId');
    const [postContent, setPostContent] = useState('');
    const [success, setSuccess] = useState(false);
    const postRef = useRef(null);
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
            setPostDummyClicked(false);
            document.body.classList.remove('modal-open')
        } catch (error) {
            console.error('Error posting:', error);
            alert('Failed to post. Please try again later.');
        }
    };

        

    useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
        document.body.classList.remove('modal-open');
    };
    }, []);
    const handlePost = () => {
        if (postContent.trim() === '') {
            alert('Post content cannot be empty');
            return;
        }
        postToMongo(postContent);
    };
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (postRef.current && postRef.current.contains(e.target)) {
                setPostDummyClicked(false);
                document.body.classList.remove('modal-open');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setPostDummyClicked]);

    return (
        <div className="post-container">
            <textarea
                autoFocus = {true}
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
