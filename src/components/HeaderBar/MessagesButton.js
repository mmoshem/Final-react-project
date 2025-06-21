import React from "react";
import { useNavigate } from "react-router-dom";

function MessagesButton({ count = 0 }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/"); 
  };

  return (
    <div className="nav-button" onClick={handleClick} style={{ cursor: "pointer" }}>
      <span className="icon">💬</span>
      {count > 0 && <span className="badge">{count}</span>}
      <div className="label">messages</div>
    </div>
  );
}

export default MessagesButton;
