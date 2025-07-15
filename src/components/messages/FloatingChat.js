// components/chat/FloatingChat.js
import React, { useState } from 'react';
import './FloatingChat.css';

export default function FloatingChat({ user, onClose }) {
  const [minimized, setMinimized] = useState(false);
  const [messageInput, setMessageInput] = useState('');

  return (
    <div className={`floating-chat ${minimized ? 'minimized' : ''}`}>
      <div className="chat-header">
        <img src={user.profilePicture} alt="profile" className="chat-avatar" />
        <span>{user.first_name} {user.last_name}</span>
        <div className="chat-controls">
          <button onClick={() => setMinimized(!minimized)}>_</button>
          <button onClick={onClose}>×</button>
        </div>
      </div>

      {!minimized && (
        <div className="chat-body">
          <div className="chat-messages">
            {/* הודעות תופענה כאן */}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Aa"
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
            />
            <button>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
