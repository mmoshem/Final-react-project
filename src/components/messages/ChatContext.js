import React, { createContext, useContext, useState, useEffect } from 'react';
import socket from '../../socketConnection';

const ChatContext = createContext();

export function useChat() {
  return useContext(ChatContext);
}

export function ChatProvider({ children }) {
  // openChats: [{ user, minimized: false }]
  const [openChats, setOpenChats] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({}); // { userId: count }
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  // עדכן userId בכל שינוי ב-localStorage (למשל אחרי login/logout)
  useEffect(() => {
    const handleStorage = () => {
      setUserId(localStorage.getItem('userId'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // אפשרות נוספת: לעדכן ידנית את userId אחרי login/logout (אם יש לך פונקציות כאלה)
  // לדוג' אחרי login: setUserId(newUserId); אחרי logout: setUserId(null);

  // Fetch unread counts from backend on load
  useEffect(() => {
    const myId = userId;
    console.log('[ChatContext] myId:', myId);
    if (myId) {
      console.log('[ChatContext] Fetching unread counts for user:', myId);
      fetch(`http://localhost:5000/api/messages/unreadCounts/${myId}`)
        .then(res => res.json())
        .then(data => {
          console.log('[ChatContext] Unread counts from server:', data);
          console.log('[ChatContext] Setting unreadCounts:', data, 'keys:', Object.keys(data));
          setUnreadCounts(data);
        });
    }
  }, [userId]);

  // Mark messages as read in backend when opening a conversation
  useEffect(() => {
    const myId = userId;
    console.log('[ChatContext] myId:', myId);
    if (selectedConversation && myId) {
      console.log('[ChatContext] Marking as read: from', selectedConversation.userId, 'to', myId);
      fetch('http://localhost:5000/api/messages/markAsRead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: selectedConversation.userId, to: myId })
      })
      .then(res => res.json())
      .then(data => {
        console.log('[ChatContext] Mark as read response:', data);
        setUnreadCounts(prev => ({
          ...prev,
          [selectedConversation.userId]: 0
        }));
      });
    }
  }, [selectedConversation, userId]);

  // פונקציה חדשה לרענון מיידי של מונה הודעות לא נקראו
  function fetchUnreadCounts(myId, setUnreadCounts) {
    if (!myId) return;
    fetch(`http://localhost:5000/api/messages/unreadCounts/${myId}`)
      .then(res => res.json())
      .then(data => {
        console.log('[ChatContext] Refetched unreadCounts:', data);
        setUnreadCounts(data);
      });
  }

  // Global socket listener for notifications
  useEffect(() => {
    const myId = String(userId);
    console.log('[ChatContext] myId:', myId);
    const handleReceive = (msg) => {
      console.log('[SOCKET] myId:', myId, 'msg.to:', msg.to, 'msg.from:', msg.from);
      if (
        String(msg.to) === myId &&
        (window.location.pathname !== "/MessagesPage" ||
        !selectedConversation ||
        String(selectedConversation.userId) !== String(msg.from))
      ) {
        console.log('[SOCKET] Fetching unreadCounts from server for myId:', myId);
        fetchUnreadCounts(myId, setUnreadCounts);
      }
    };
    socket.on('receiveMessage', handleReceive);
    return () => {
      socket.off('receiveMessage', handleReceive);
    };
  }, [selectedConversation, setUnreadCounts, userId]);

  // אפס context והתחבר מחדש ל-socket בכל שינוי userId
  useEffect(() => {
    if (userId && socket) {
      socket.connect();
      socket.emit('register', userId);
      fetchUnreadCounts(userId, setUnreadCounts);
      console.log('[ChatContext] userId התחבר:', userId);
    } else {
      setUnreadCounts({});
      setSelectedConversation(null);
      if (socket) socket.disconnect();
      console.log('[ChatContext] userId התנתק או לא קיים, אפסנו context');
    }
  }, [userId]);

  const openChat = (user) => {
    setOpenChats(prev => {
      // אם כבר פתוח צ'אט לאותו יוזר, נביא אותו לסוף (הכי עדכני)
      const existingIndex = prev.findIndex(c => c.user.userId === user.userId);
      if (existingIndex !== -1) {
        // bring to front (end of array)
        const updated = [...prev];
        const [chat] = updated.splice(existingIndex, 1);
        updated.push(chat);
        return updated;
      }
      // אם יש שניים, מסירים את הראשון
      if (prev.length >= 2) {
        return [...prev.slice(1), { user, minimized: false }];
      }
      // אחרת מוסיפים
      return [...prev, { user, minimized: false }];
    });
  };

  const closeChat = (userId) => {
    setOpenChats(prev => prev.filter(c => c.user.userId !== userId));
  };

  const minimizeChat = (userId) => {
    setOpenChats(prev => prev.map(c =>
      c.user.userId === userId ? { ...c, minimized: true } : c
    ));
  };

  const restoreChat = (userId) => {
    setOpenChats(prev => prev.map(c =>
      c.user.userId === userId ? { ...c, minimized: false } : c
    ));
  };

  const closeAllChats = () => setOpenChats([]);

  return (
    <ChatContext.Provider value={{
      openChats,
      openChat,
      closeChat,
      minimizeChat,
      restoreChat,
      closeAllChats,
      unreadCounts,
      setUnreadCounts,
      selectedConversation,
      setSelectedConversation
    }}>
      {children}
    </ChatContext.Provider>
  );
} 