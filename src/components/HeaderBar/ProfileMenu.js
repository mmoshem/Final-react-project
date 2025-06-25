import React, { useState, useRef, useEffect } from 'react';
import './ProfileMenu.css';
import { Link } from 'react-router-dom';

export default function ProfileMenu({ profilePicture }) {
  const [MenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  //for closing the dropdwon when clicking outside the opened menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
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
        
        onClick={() => setMenuOpen(!MenuOpen)}
      />

      {MenuOpen && (
        <div className="dropdown">
          <Link to="/profile">My Profile</Link>
          <hr/>
          <Link to="/settings">Settings</Link>
          <hr/>
        </div>
      )}
    </div>
  );
}
