import React from 'react';
import styles from './PostLikes.module.css';

const PostLikes = ({ likes }) => (
  <div className={styles.postLikes}>
    {likes > 0 ? `Likes: ${likes}` : 'No likes yet'}
  </div>
);

export default PostLikes; 