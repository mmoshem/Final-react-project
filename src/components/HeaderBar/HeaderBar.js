import React from "react";
import SearchBar from "./SearchBar";
import HomeButton from "./HomeButton";
import MessagesButton from "./MessagesButton";
import LogoutButton from '../LogoutButton';
import ProfileMenu from "./ProfileMenu";
//import NetworkButton from "./NetworkButton";
//import ProfileButton from "./ProfileButton";
import "./Header.css";





function HeaderBar({ profilePicture}) {
  return (
    <div className="header-bar">

      {/* שורת חיפוש */}
      <SearchBar/>
      
      {/* כפתורים */}
      <div className="header-buttons">
        <HomeButton />
        <ProfileMenu profilePicture={profilePicture}/>
        <MessagesButton count={0} />
         <LogoutButton />
      </div>
    </div>
  );
}

export default HeaderBar;
