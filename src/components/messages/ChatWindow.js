// components/messages/ChatWindow.js
import React from 'react';
import './ChatWindow.css';

export default function ChatWindow({ selectedConversation }) {
  return (
    <div className="chat-window">
      {selectedConversation ? (
        <div>
          <h3>Chat with {selectedConversation.name}</h3>
          {/* כאן יהיו ההודעות בעתיד */}
        </div>
      ) : (
        <div className="select-conversation">
          <p>Select a conversation</p>
          <small>Choose a conversation from the list to start messaging</small>
        </div>
      )}
    </div>
  );
}
