// components/chat/FloatingChat.js
import React, { useState } from 'react';
import './FloatingChat.css';

export default function FloatingChat({ user, onClose, isMinimized, minimizeChat, restoreChat, positionIndex = 0 }) {
  // Each chat window has its own messageInput state
  const [messageInput, setMessageInput] = useState('');

  return (
    <div className={`floating-chat ${isMinimized ? 'minimized' : ''} chat-pos-${positionIndex}`}>
      <div className="chat-header">
        <img src={user.profilePicture} alt="profile" className="chat-avatar" />
        <span>{user.first_name} {user.last_name}</span>
        <div className="chat-controls">
          <button onClick={() => isMinimized ? restoreChat() : minimizeChat()}>_</button>
          <button onClick={onClose}>×</button>
        </div>
      </div>
      {!isMinimized && (
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
