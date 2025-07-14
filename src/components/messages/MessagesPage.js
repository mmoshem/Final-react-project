// components/messages/MessagesPage.js
import React, { useState } from 'react';
import './MessagePage.css';
import HeaderBar from '../HeaderBar/HeaderBar';
import ConversationsList from './ConversationsList';
import ChatWindow from './ChatWindow';

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div>
      <HeaderBar />
      <div className="messages-outer-container">
        <div className="messages-page">
          <ConversationsList onSelectConversation={setSelectedConversation} />
          <ChatWindow selectedConversation={selectedConversation} />
        </div>
      </div>
    </div>
  );
}
