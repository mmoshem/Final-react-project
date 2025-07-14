// components/messages/ConversationsList.js
import React from 'react';
import './ConversationsList.css';

export default function ConversationsList({ onSelectConversation }) {
  return (
    <div className="conversations-list">
      <h2>Messages</h2>
      <input type="text" placeholder="Search conversations..." />
      <div className="no-conversations">
        <p>No conversations yet</p>
        <small>Start a conversation from someone's profile</small>
      </div>
    </div>
  );
}
