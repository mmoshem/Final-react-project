import React, { useRef, useEffect, useState } from 'react';
import styles from './PostItem.module.css';
import ProfilePicture from '../ProfilePicture';
import PostContent from './PostContent';
import MediaThumbnailsRow from './MediaThumbnailsRow';
import InlineCommentsPanel from './InlineCommentsPanel';
import axios from 'axios';

const PostItem = ({
  item,
  currentUserId,
  onDelete,
  onEdit,
  onMediaThumbClick,
  selectedIndex,
  setSelectedIndex,
  commentsRef,
  groupId = null
}) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (commentsRef.current && !commentsRef.current.contains(event.target)) {
        setSelectedIndex(null);
      }
    };
    if (selectedIndex === item._id) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedIndex, item._id, setSelectedIndex, commentsRef]);

  // Check if current user has liked the post
  const hasLiked = (item.likedBy || []).some(user => user.toString() === currentUserId);
  const [liked, setLiked] = useState(hasLiked);
  const [likeCount, setLikeCount] = useState((item.likedBy || []).length);
  const [likeInProgress, setLikeInProgress] = useState(false);

  const like = async () => {
    setLikeInProgress(true);
    try {
      let response;
      if (item.groupId || groupId) {
        // Like group post
        const gid = item.groupId || groupId;
        response = await axios.post(`http://localhost:5000/api/groups/${gid}/posts/${item._id}/like`, {
          userId: currentUserId
        });
      } else {
        // Like regular post
        response = await axios.post(`http://localhost:5000/api/posts/like`, {
          userId: currentUserId,
          postID: item._id
        });
      }
      
      if (response.status === 200 && response.data) {
        setLiked(response.data.liked);
        setLikeCount(response.data.likeCount);
      }
    } catch (error) {
      console.error('Error liking post:', error);
      alert('Failed to like the post.');
    } finally {
      setLikeInProgress(false);
    }
  };

  const handleGroupClick = () => {
    if (item.groupInfo) {
      // Navigate to group page
      window.location.href = `/groups/${item.groupInfo._id}`;
    }
  };
  
  return (
    <div
      className={styles.listItem}
      onClick={() => setSelectedIndex(item._id)}
      style={{ position: 'relative' }}
    >
     
      {item.userId === currentUserId && (
        <div>
          <button onClick={e => { e.stopPropagation(); onDelete(item._id, item.mediaUrls); }}>
            Delete
          </button>
          <button onClick={e => { e.stopPropagation(); onEdit(item._id); }}>
            Edit 
          </button>     
        </div>
      )}
      <ProfilePicture
        src={item.profilePicture}
        alt="Profile"
      />
      <div className={styles.itemContent}>
        <div className={styles.userName}>
          {item.first_name || ''} {item.last_name || ''}
        </div>
        {item.createdAt && (
          <div className={styles.postDate}>
            {new Date(item.createdAt).toLocaleString()}
          </div>
        )}
        
        {/* Group information - only show in home feed, not in group page */}
        {item.groupInfo && !groupId && (
          <div className={styles.groupInfo} onClick={handleGroupClick}>
            <div className={styles.groupBadge}>
              {item.groupInfo.image && (
                <img 
                  src={item.groupInfo.image} 
                  alt={item.groupInfo.name}
                  className={styles.groupIcon}
                />
              )}
              <span className={styles.groupName}>
                📍 {item.groupInfo.name}
              </span>
            </div>
          </div>
        )}
        
        <PostContent content={item.content} />
        {Array.isArray(item.mediaUrls) && item.mediaUrls.length > 0 && (
          <MediaThumbnailsRow
            mediaArray={item.mediaUrls}
            onThumbClick={idx => onMediaThumbClick(item.mediaUrls, idx)}
          />
        )}
        <button onClick={e => { e.stopPropagation(); like(); }} disabled={likeInProgress}>
         {liked ? 'dislike' : 'like'}
        </button>

        <div>
           {likeCount > 0 ? `Likes: ${likeCount}` : 'No likes yet'}
        </div>
      </div>
      {selectedIndex === item._id && (
        <InlineCommentsPanel ref={commentsRef} />
      )}
    </div>
  );
};

export default PostItem; 