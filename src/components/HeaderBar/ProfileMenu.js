import React, { useState, useRef, useEffect } from 'react';
import './ProfileMenu.css';

export default function ProfileMenu({ profilePicture }) {
  const [MenueOpen, setMenueOpen] = useState(false);
  const menuRef = useRef();
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenueOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="profile-menu" ref={menuRef}>
      <img
        src={profilePicture || "https://www.w3schools.com/howto/img_avatar.png"}
        alt="Profile"
        className="profile-icon"
        
        onClick={() => setMenueOpen(!MenueOpen)}
      />

      {MenueOpen && (
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
