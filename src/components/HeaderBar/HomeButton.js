import React from "react";
import { useNavigate } from "react-router-dom";

function HomeButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/home");
  };

  return (
    <button 
      className="nav-button"
      onClick={handleClick}>
      
      home
      
    </button>
  );
}
export default HomeButton;
