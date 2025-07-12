import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './GroupAllPosts.css';

// ItemList component (inline)
function ItemList({ items, loading }) {
    if (loading) {
        return (
            <div className="loading-posts">
                <p>Loading posts...</p>
            </div>
        );
    }
    
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
                        <div className="post-author-info">
                            <img 
                                src={post.userId?.profilePicture?.trim() ? post.userId.profilePicture : '/default-avatar.png'} 
                                alt={post.userId?.name || 'User'}
                                className="post-author-pic"
                                style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: '50%',
                                    marginRight: '10px'
                                }}
                            />
                            <div>
                                <span className="post-author" style={{ textTransform: 'capitalize', fontWeight: 600 }}>
                                    {post.userId?.name?.trim() || 'Unknown User'}
                                </span>
                                <span className="post-time" style={{ display: 'block', color: '#888', fontSize: '12px' }}>
                                    {new Date(post.createdAt).toLocaleString()}
                                </span>
                            </div>
                        </div>
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
    const [loading, setLoading] = useState(true); // ADD loading state
    const intervalRef = useRef();

    const fetchPosts = async () => {
        // Only fetch posts if user has permission to view them
        if (!canViewPosts) {
            return;
        }

        try {
            setLoading(true); // Set loading true when fetching
            const res = await axios.get(`http://localhost:5000/api/groups/${groupId}/posts`);
            console.log('Fetched group posts:', res.data);
            if (res.data.length > 0) {
                console.log('First post user data:', res.data[0].userId);
            }
            setAllGroupPosts(res.data);
        } catch (error) {
            console.error('Error fetching group posts:', error);
        } finally {
            setLoading(false); // Set loading false when done
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
            <ItemList items={allGroupPosts} loading={loading} />
        </div>
    );
}