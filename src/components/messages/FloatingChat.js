// components/chat/FloatingChat.js
import React, { useState, useEffect, useRef } from 'react';
import './FloatingChat.css';
import socket from '../../socketConnection';

export default function FloatingChat({ user, onClose, isMinimized, minimizeChat, restoreChat, positionIndex = 0 }) {
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const myId = localStorage.getItem('userId');

  // Fetch message history when chat opens or user changes
  useEffect(() => {
    const fetchHistory = async () => {
      if (!myId || !user.userId) return;
      try {
        const res = await fetch(`http://localhost:5000/api/messages/${myId}/${user.userId}`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error('Failed to fetch chat history:', err);
      }
    };
    fetchHistory();
  }, [user.userId, myId]);

  useEffect(() => {
    // Listener for incoming messages
    const handleReceive = (msg) => {
      // בדוק אם ההודעה כבר קיימת (לפי מזהה ייחודי בסיסי)
      if (messages.some(m =>
        m.from === msg.from &&
        m.to === msg.to &&
        m.text === msg.text &&
        m.time === msg.time
      )) {
        return;
      }
      if (msg.from === user.userId || msg.to === user.userId) {
        setMessages(prev => [...prev, msg]);
      }
    };
    socket.on('receiveMessage', handleReceive);
    return () => {
      socket.off('receiveMessage', handleReceive);
    };
  }, [user.userId, myId, messages]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (!messageInput.trim()) return;
    const msg = {
      from: myId,
      to: user.userId,
      text: messageInput,
      time: new Date().toISOString()
    };
    socket.emit('sendMessage', msg);
    setMessages(prev => [...prev, msg]);
    setMessageInput('');
  };

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
            {messages.map((msg, idx) => {
              const showDate =
                idx === 0 ||
                new Date(msg.time).toDateString() !== new Date(messages[idx - 1].time).toDateString();
              return (
                <React.Fragment key={idx}>
                  {showDate && (
                    <div className="msg-date">
                      {new Date(msg.time).toLocaleDateString()}
                    </div>
                  )}
                  <div className={msg.from === myId ? 'my-message' : 'their-message'}>
                    {msg.text}
                    <div className="msg-time">
                      {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Aa"
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
