import React, { useState } from 'react';
import './FollowButton.css';

export default function FollowButton() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = () => {
    if (isFollowing) {
      setShowConfirm(true);
    } else {
      setIsFollowing(true);
      // כאן אפשר לשלוח לשרת "follow"
    }
  };

  const confirmUnfollow = () => {
    setIsFollowing(false);
    setShowConfirm(false);
    // כאן אפשר לשלוח לשרת "unfollow"
  };

  const cancelUnfollow = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <button
        className={`follow-btn ${isFollowing ? 'unfollow' : ''}`}
        onClick={handleClick}
      >
        {isFollowing ? 'Unfollow' : 'Follow'}
      </button>

      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>Are you sure you want to unfollow?</p>
            <div className="modal-actions">
              <button onClick={confirmUnfollow}>Yes</button>
              <button onClick={cancelUnfollow}>No</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
