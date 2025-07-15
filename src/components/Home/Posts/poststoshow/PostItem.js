import React, { useRef, useEffect, useState } from 'react';
import styles from './PostItem.module.css';
import ProfilePicture from '../ProfilePicture';
import PostContent from './PostContent';
import MediaThumbnailsRow from './MediaThumbnailsRow';
import InlineCommentsPanel from './InlineCommentsPanel';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PostItem = ({
  item,
  currentUserId,
  onDelete,
  onEdit,
  onMediaThumbClick,
  selectedIndex,
  setSelectedIndex,
  commentsRef,
  admin,
 ingroup = false,
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
  const [likeInProgress,setLikeInProgress] = useState(false);

  const like = async () => {
    setLikeInProgress(true);
    try {
      const response = await axios.post(`http://localhost:5000/api/posts/like`, {
        userId: currentUserId,
        postID: item._id
      });
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
  

  
  return (
    <div
      className={styles.listItem}
      onClick={() => setSelectedIndex(item._id)}
      style={{ position: 'relative' }}
    >
     
      {(admin||item.userId === currentUserId) && (
        <div>
          <button onClick={e => { e.stopPropagation(); onDelete(item._id,item.mediaUrls); }}>
            Delete
          </button>
      </div>
      )}
      {item.userId === currentUserId && (
        <div>
          <button onClick={e => { e.stopPropagation(); onEdit(item._id); }}>
            Edit 
          </button>     
        </div>
        )}
      <ProfilePicture
        imageStyle={styles.profilePicture}
        src={item.profilePicture}
        alt="Profile"
      />
      <div className={styles.itemContent}>
        <div className={styles.userName}>
          {item.first_name || ''} {item.last_name || ''}
        </div>
        {item.createdAt && (
          <div className={styles.postDate}>
            {item.groupname&& !ingroup && (
              <div>
              <Link to={`/groups/${item.groupId}`}  className={styles.linkstyle} key={item.groupId}>  
                    {item.groupImage&& !ingroup&&(
                      < ProfilePicture imageStyle={styles.groupPicture} src={item.groupImage}  alt = "group image"  />
                    )}
                    <span className={styles.groupNameLink}>group: {item.groupname}</span>
                    
                    </Link >
              </div>
            )}
              
            
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