import React from "react";
import { useNavigate } from "react-router-dom";
import './MessagesButton.css';

function MessagesButton({ count = 0 }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/MessagesPage"); 
  };

  return (
    <button 
      className="messages-button pill-button"
      onClick={handleClick}>
      <div className="button-content">
        <div className="button-text">messages</div>
      </div>
    </button>
  );
}

export default MessagesButton;