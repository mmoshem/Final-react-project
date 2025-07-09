import React, { useRef, useEffect, useState } from 'react';
import styles from './PostItem.module.css';
import ProfilePicture from '../ProfilePicture';
import PostContent from './PostContent';
import MediaThumbnailsRow from './MediaThumbnailsRow';
import PostLikes from './PostLikes';
import InlineCommentsPanel from './InlineCommentsPanel';
import axios from 'axios';
const PostItem = ({
  item,
  currentUserId,
  onDelete,
  onMediaThumbClick,
  selectedIndex,
  setSelectedIndex,
  commentsRef
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

  // // Flatten mediaUrls if needed
  // let flatMediaUrls = Array.isArray(item.mediaUrls) && Array.isArray(item.mediaUrls[0])
  //   ? item.mediaUrls[0]
  //   : item.mediaUrls;
  

  // Add local state for likes
  const [likes, setLikes] = useState(item.likes);

  // Check if current user has liked the post
  const hasLiked = likes.users.some(user => user.toString() === currentUserId);

const [isLiking, setIsLiking] = useState(false);

const like = async () => {
  if (!item._id || !currentUserId || isLiking) return;

  setIsLiking(true);
  try {
    const response = await axios.post(`http://localhost:5000/api/posts/like`, {
      userId: currentUserId,
      postID: item._id
    });
    if (response.status === 200 && response.data) {
      setLikes(response.data);
    }
  } catch (error) {
    console.error('Error liking post:', error);
    alert('Failed to like the post.');
  } finally {
    setIsLiking(false);
  }
};


  
  return (
    <div
      className={styles.listItem}
      onClick={() => setSelectedIndex(item._id)}
      style={{ position: 'relative' }}
    >
     
      {item.userId === currentUserId && (
        <button onClick={e => { e.stopPropagation(); onDelete(item._id,item.mediaUrls); }}>
          Delete
        </button>
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
        <PostContent content={item.content} />
        {Array.isArray(item.mediaUrls) && (
          <MediaThumbnailsRow
            mediaArray={item.mediaUrls}
            onThumbClick={idx => onMediaThumbClick(item.mediaUrls, idx)}
          />
        )}
        <button onClick={e => { e.stopPropagation(); like(); }} disabled={isLiking}>
         {hasLiked ? 'dislike' : 'like'}
        </button>

        <PostLikes likes={likes.numberOfLikes} />
      </div>
      {selectedIndex === item._id && (
        <InlineCommentsPanel ref={commentsRef} />
      )}
    </div>
  );
};

export default PostItem; 