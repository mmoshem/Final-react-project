// ItemList.js
import React from 'react';
import './ItemList.css';

const ItemList = ({ items }) => {
  return (
    <div className="list-container">
      {items.map((item, index) => (
        <div key={index} className="list-item">
          <img
            src={item.profilePicture && item.profilePicture.trim() ? item.profilePicture : "https://www.w3schools.com/howto/img_avatar.png"}
            alt="Profile"
            className="profile-picture"
          />
          <div className="item-content">
            <div className="user-name">
              {item.first_name || ''} {item.last_name || ''}
            </div>
            <div className="post-content">
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemList;
