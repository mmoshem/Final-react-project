// ItemList.js
import React, { useState, useRef, useEffect } from 'react';
import './ItemList.css';

const ItemList = ({ items }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const commentsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (commentsRef.current && !commentsRef.current.contains(event.target)) {
        setSelectedIndex(null);
      }
    };

    if (selectedIndex !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedIndex]);

  if (!Array.isArray(items) || items.length === 0) {
    return <div className="list-container">No posts available.</div>;
  }

  return (
    <div className="list-container">
      {items.map((item, index) => (
        <div
          key={index}
          className="list-item"
          onClick={() => setSelectedIndex(index)}
          style={{ position: 'relative' }}
        >
          {item.imageUrl && (
            <img src={item.imageUrl} alt="Post" className="post-image" />
          )}

          <img
            src={
              item.profilePicture?.trim()
                ? item.profilePicture
                : 'https://www.w3schools.com/howto/img_avatar.png'
            }
            alt="Profile"
            className="profile-picture"
          />

          <div className="item-content">
            <div className="user-name">
              {item.first_name || ''} {item.last_name || ''}
            </div>

            {item.createdAt && (
              <div className="post-date">
                {new Date(item.createdAt).toLocaleString()}
              </div>
            )}

            <div className="post-content">
              {item.content?.split('\n').map((line, i) => (
                <h key={i}>{line}<br></br></h>
              ))}
            </div>
            <div className="post-likes">
              {item.likes  > 0
                ? `Likes: ${item.likes}`
                : 'No likes yet'}
           </div>
          </div>
          
          {selectedIndex === index && (
            <div className="inline-comments-panel" ref={commentsRef}>
              <h3>Comments</h3>
              <p>Comments coming soon for this post!</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ItemList;
