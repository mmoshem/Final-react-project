import React, { useState, useRef, useEffect } from 'react';
import './ProfileMenu.css';

export default function ProfileMenu({ profilePicture }) {
  const [open, setOpen] = useState(false);


 

  return (
    <div className="profile-menu" ref={menuRef}>
      <img
        src={profilePicture || "https://www.w3schools.com/howto/img_avatar.png"}
        alt="Profile"
        className="profile-icon"
        
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="dropdown">
          <a href="/profile">My Profile</a>
          <hr/>
          <a href="/settings">Settings</a>
          <hr/>
        </div>
      )}
    </div>
  );
}
