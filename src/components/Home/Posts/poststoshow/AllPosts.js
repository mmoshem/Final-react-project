import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ItemList from './ItemList';
import './AllPosts.css';

export default function AllPosts({ refreshTrigger }) {
    const [allusersPosts, setAllusersPosts] = useState([]);
    const intervalRef = useRef();

    const fetchPosts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/posts');
            console.log('Home page posts:', res.data); // ADD THIS
            if (res.data.length > 0) {
                console.log('First post structure:', res.data[0]); // ADD THIS
            }
            setAllusersPosts(res.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetchPosts(); // Fetch on mount
        intervalRef.current = setInterval(fetchPosts, 60000); // Fetch every 1 min
        return () => clearInterval(intervalRef.current); // Cleanup on unmount
    }, []);

    useEffect(() => {
        if (refreshTrigger !== undefined) {
            fetchPosts();
        }
    }, [refreshTrigger]);

    return (
        <div className="all-posts">
            <h2>All Posts</h2>
            <ItemList items={allusersPosts} refreshPosts={fetchPosts} />
        </div>
    );
}