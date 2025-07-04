import React, { useRef, useEffect } from 'react';
import styles from './PostItem.module.css';
import ProfilePicture from './ProfilePicture';
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
  

  const like = async ()=>{
    await axios.post(`/api/posts/${item._id}/like`, { userId: currentUserId });
  }
  
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
        <button onClick={like}>like</button>
        <PostLikes likes={item.likes} />
      </div>
      {selectedIndex === item._id && (
        <InlineCommentsPanel ref={commentsRef} />
      )}
    </div>
  );
};

export default PostItem; 