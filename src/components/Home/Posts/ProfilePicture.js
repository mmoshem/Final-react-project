import React from 'react';
import styles from './ProfilePicture.module.css';

const ProfilePicture = ({ src, alt }) => {
  const fallback = 'https://www.w3schools.com/howto/img_avatar.png';
  const imageSrc = src && src.trim() ? src : fallback;
  return <img src={imageSrc} alt={alt} className={styles.profilePicture} />;
};

export default ProfilePicture; 