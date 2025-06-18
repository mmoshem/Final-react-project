import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './components/LandingPage';
// import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home/>}  />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
