import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export function useChat() {
  return useContext(ChatContext);
}

export function ChatProvider({ children }) {
  // openChats: [{ user, minimized: false }]
  const [openChats, setOpenChats] = useState([]);

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
      closeAllChats
    }}>
      {children}
    </ChatContext.Provider>
  );
} 