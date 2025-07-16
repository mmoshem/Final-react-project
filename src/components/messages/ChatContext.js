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

  // Global socket listener for notifications
  useEffect(() => {
    const myId = localStorage.getItem('userId');
    const handleReceive = (msg) => {
      // נגדיל מונה רק אם המשתמש הנוכחי הוא המקבל
      if (
        msg.to === myId &&
        (window.location.pathname !== "/MessagesPage" ||
        !selectedConversation ||
        selectedConversation.userId !== msg.from)
      ) {
        console.log('[ChatContext] Incrementing unread count for user:', msg.from);
        setUnreadCounts(prev => ({
          ...prev,
          [msg.from]: (prev[msg.from] || 0) + 1
        }));
      }
    };
    socket.on('receiveMessage', handleReceive);
    return () => {
      socket.off('receiveMessage', handleReceive);
    };
  }, [selectedConversation, setUnreadCounts]);

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