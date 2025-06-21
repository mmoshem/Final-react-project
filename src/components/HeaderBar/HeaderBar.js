import React from "react";
import SearchBar from "./SearchBar";
import HomeButton from "./HomeButton";
import MessagesButton from "./MessagesButton";
import LogoutButton from '../LogoutButton';
//import NetworkButton from "./NetworkButton";
//import ProfileButton from "./ProfileButton";
import { useState } from "react";
import "./Header.css";





function HeaderBar() {
 
  const [searchText, setSearchText] = useState("");
 
  const handleSearchChange = (text) => {
  setSearchText(text);
  // You can add additional logic here, like filtering results based on the search text
}


  return (
    <div className="header-bar">

      {/* שורת חיפוש */}
      <SearchBar  value={searchText} onSearchChange={handleSearchChange} />

      {/* כפתורים */}
      <div className="header-buttons">
        <HomeButton />
        <MessagesButton count={0} />
         <LogoutButton />
      </div>
    </div>
  );
}

export default HeaderBar;
