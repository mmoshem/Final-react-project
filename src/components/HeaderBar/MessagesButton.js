import React from "react";
import { useNavigate } from "react-router-dom";

function MessagesButton({ count = 0 }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/"); 
  };

  return (
    <button 
      className="nav-button" 
      onClick={handleClick}
      style={{ 
        border: 'none', 
        background: 'none', 
        padding: 0,
        cursor: 'pointer'
      }}
    >
      <span className="icon">💬</span>
      {count > 0 && <span className="badge">{count}</span>}
      <div className="label">messages</div>
    </button>
  );
}

export default MessagesButton;
