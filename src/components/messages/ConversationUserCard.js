import React from 'react';
import './ConversationUserCard.css';

export default function ConversationUserCard({ user, onClick }) {
  return (
    <div className="conversation-user-card" onClick={onClick}>
      {user.profilePicture && (
        <img
          src={user.profilePicture}
          alt="Profile"
          className="conversation-user-avatar"
        />
      )}
      <span className="conversation-user-name">
        {user.first_name} {user.last_name}
      </span>
    </div>
  );
} 