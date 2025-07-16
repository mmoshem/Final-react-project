import React from "react";
import { useNavigate } from "react-router-dom";
import './MessagesButton.css';

function MessagesButton({ count = 0 }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/MessagesPage"); 
  };

  if (count > 0) {
    console.log('[MessagesButton] Showing badge with count:', count);
  }

  return (
    <button 
      className="messages-button pill-button"
      onClick={handleClick}>
      <div className="button-content">
        <div className="button-text">Messages</div>
        {count > 0 && <span className="badge">{count}</span>}
      </div>
    </button>
  );
}

export default MessagesButton;