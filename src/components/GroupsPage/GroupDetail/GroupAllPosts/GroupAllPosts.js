import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './GroupAllPosts.css';

// ItemList component (inline)
function ItemList({ items }) {
    if (!items || items.length === 0) {
        return (
            <div className="no-posts">
                <p>No posts yet. Be the first to share something!</p>
            </div>
        );
    }

    return (
        <div className="posts-list">
            {items.map((post) => (
                <div key={post._id} className="post-item">
                    <div className="post-header">
                        <span className="post-author">
                            {post.userId?.name || 'Unknown User'}
                        </span>
                        <span className="post-time">
                            {new Date(post.createdAt).toLocaleString()}
                        </span>
                    </div>
                    <div className="post-content">
                        {post.content}
                    </div>
                    {post.imageUrl && (
                        <div className="post-image">
                            <img 
                                src={post.imageUrl} 
                                alt="Post" 
                                style={{ maxWidth: '100%', borderRadius: '8px' }}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default function GroupAllPosts({ groupId, refreshTrigger, canViewPosts = true }) {
    const [allGroupPosts, setAllGroupPosts] = useState([]);
    const intervalRef = useRef();

    const fetchPosts = async () => {
        // Only fetch posts if user has permission to view them
        if (!canViewPosts) {
            return;
        }

        try {
            const res = await axios.get(`http://localhost:5000/api/groups/${groupId}/posts`);
            setAllGroupPosts(res.data);
        } catch (error) {
            console.error('Error fetching group posts:', error);
        }
    };

    useEffect(() => {
        if (canViewPosts) {
            fetchPosts(); // Fetch on mount only if user has permission
            intervalRef.current = setInterval(fetchPosts, 60000); // Fetch every 1 min
        }
        return () => clearInterval(intervalRef.current); // Cleanup on unmount
    }, [groupId, canViewPosts]);

    useEffect(() => {
        if (refreshTrigger !== undefined && canViewPosts) {
            fetchPosts();
        }
    }, [refreshTrigger, canViewPosts]);

    // If user doesn't have permission to view posts, show a message
    if (!canViewPosts) {
        return (
            <div className="group-all-posts">
                <h2>Group Posts</h2>
                <div className="no-access-message">
                    <p>Join this group to view posts and participate in discussions!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="group-all-posts">
            <h2>Group Posts</h2>
            <ItemList items={allGroupPosts} />
        </div>
    );
}