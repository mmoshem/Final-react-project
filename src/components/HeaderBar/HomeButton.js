import React from "react";
import { useNavigate } from "react-router-dom";

function NavButton({ icon, label, count }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/home");
  };

  return (
    <div className="nav-button" onClick={handleClick} style={{ cursor: "pointer" }}>
      <span className="icon">{icon}</span>
      {count > 0 && <span className="badge">{count}</span>}
      <div className="label">{label}</div>
    </div>
  );
}

export default NavButton;
