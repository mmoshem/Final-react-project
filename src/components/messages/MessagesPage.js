// components/messages/MessagesPage.js
import React, { useState } from 'react';
import './MessagePage.css';
import HeaderBar from '../HeaderBar/HeaderBar';
import ConversationsList from './ConversationsList';
import ChatWindow from './ChatWindow';
import { useChat } from './ChatContext';
import { useEffect } from 'react';

export default function MessagesPage() {
  const { selectedConversation, setSelectedConversation, setUnreadCounts } = useChat();

  useEffect(() => {
    if (selectedConversation) {
      console.log('[MessagesPage] Resetting unread count for user:', selectedConversation.userId);
      setUnreadCounts(prev => ({
        ...prev,
        [selectedConversation.userId]: 0
      }));
    }
  }, [selectedConversation, setUnreadCounts]);

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
