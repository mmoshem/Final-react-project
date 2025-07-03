import React, { useRef, useEffect } from 'react';
import styles from './PostItem.module.css';
import ProfilePicture from './ProfilePicture';
import PostContent from './PostContent';
import MediaThumbnailsRow from './MediaThumbnailsRow';
import PostLikes from './PostLikes';
import InlineCommentsPanel from './InlineCommentsPanel';

const PostItem = ({
  item,
  currentUserId,
  onDelete,
  onMediaThumbClick,
  onImageClick,
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

  // Flatten mediaUrls if needed
  let flatMediaUrls = Array.isArray(item.mediaUrls) && Array.isArray(item.mediaUrls[0])
    ? item.mediaUrls[0]
    : item.mediaUrls;

  return (
    <div
      className={styles.listItem}
      onClick={() => setSelectedIndex(item._id)}
      style={{ position: 'relative' }}
    >
      {item.userId === currentUserId && (
        <button onClick={e => { e.stopPropagation(); onDelete(item._id); }}>
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
        {Array.isArray(flatMediaUrls) && flatMediaUrls.length > 0 && (
          <MediaThumbnailsRow
            mediaArray={flatMediaUrls}
            onThumbClick={idx => onMediaThumbClick(flatMediaUrls, idx)}
          />
        )}
        <PostLikes likes={item.likes} />
      </div>
      {selectedIndex === item._id && (
        <InlineCommentsPanel ref={commentsRef} />
      )}
    </div>
  );
};

export default PostItem; 