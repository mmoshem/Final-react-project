import React, { useState } from 'react';
import Post from '../../Home/Posts/posting/Post';
import AllPosts from '../../Home/Posts/poststoshow/AllPosts';

const GroupPostContainer = ({ groupId, onPostSuccess }) => {
    const [isPosting, setIsPosting] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handlePostSuccess = () => {
        setIsPosting(false);
        setIsLocked(false);
        setRefreshTrigger(prev => prev + 1);
        if (onPostSuccess) {
            onPostSuccess();
        }
    };

    const handleClosePost = () => {
        setIsPosting(false);
        setIsLocked(false);
    };

    return (
        <div className="group-post-container">
            {/* Post creation section */}
            {isPosting ? (
                <Post
                    setIsLocked={setIsLocked}
                    onPostSuccess={handlePostSuccess}
                    onClose={handleClosePost}
                    groupId={groupId}
                />
            ) : (
                <div className="group-post-trigger">
                    <button 
                        onClick={() => setIsPosting(true)}
                        className="create-post-btn"
                        style={{
                            width: '100%',
                            padding: '15px',
                            border: '2px dashed #ccc',
                            borderRadius: '8px',
                            background: 'transparent',
                            cursor: 'pointer',
                            fontSize: '16px',
                            color: '#666'
                        }}
                    >
                        📝 What's on your mind in this group?
                    </button>
                </div>
            )}

            {/* Posts display section */}
            <div className="group-posts-display">
                <AllPosts 
                    filterType="group"
                    groupId={groupId}
                    refreshTrigger={refreshTrigger}
                />
            </div>
        </div>
    );
};

export default GroupPostContainer; 