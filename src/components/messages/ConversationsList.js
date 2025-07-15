// components/messages/ConversationsList.js
import React, { useEffect, useState } from 'react';
import './ConversationsList.css';
import ConversationUserCard from './ConversationUserCard';

export default function ConversationsList({ onSelectConversation }) {
  const [conversations, setConversations] = useState([]);
  const myId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/messages/conversations/${myId}`);
        const data = await res.json();
        setConversations(data);
      } catch (err) {
        setConversations([]);
      }
    };
    fetchConversations();
  }, [myId]);

  return (
    <div className="conversations-list">
      <h2>Messages</h2>
      <input type="text" placeholder="Search conversations..." />
      {conversations.length === 0 ? (
        <div className="no-conversations">
          <p>No conversations yet</p>
          <small>Start a conversation from someone's profile</small>
        </div>
      ) : (
        <div className="conversations-users-list">
          {conversations.map(user => (
            <ConversationUserCard key={user.userId} user={user} onClick={() => onSelectConversation(user)} />
          ))}
        </div>
      )}
    </div>
  );
}
