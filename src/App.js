import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './components/LandingPage';
import MessagesPage from './components/messages/MessagesPage';
import GroupsPage from './components/GroupsPage/GroupsPage';
import GroupDetail from './components/GroupsPage/GroupDetail/GroupDetail';
import CreateGroupPage from './components/GroupsPage/CreateGroup/CreateGroupPage';
import Register from './components/Register';
import Home from './components/Home/Home';
import UserProfile from './components/profile/UserProfile';
import UserSettings from './components/UserSettings/UserSettings';

import socket from './socketConnection'; // ← ודאי שהנתיב תואם לקובץ שלך

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ מחובר ל־Socket.io עם ID:", socket.id);
    });

    socket.on("receiveMessage", (data) => {
      console.log("📩 התקבלה הודעה:", data);
    });

    return () => {
      socket.off("connect");
      socket.off("receiveMessage");
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/MessagesPage" element={<MessagesPage />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/groups/create" element={<CreateGroupPage />} />
          <Route path="/groups/:groupId" element={<GroupDetail />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="/GroupsPage" element={<GroupsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
