import React from "react";
import SearchBar from "./SearchBar";
import ProfileMenu from "./ProfileMenu";
import HomeButton from "./HomeButton";
import MessagesButton from "./MessagesButton";
import LogoutButton from './LogoutButton';
import GroupsButton from "./GroupsButton";
import "./Header.css";





function HeaderBar({ profilePicture}) {
  return (
    <div className="header-bar">

      {/* שורת חיפוש */}
      <SearchBar/>
      
      {/* כפתורים */}
      <div className="header-buttons">
        <ProfileMenu profilePicture={profilePicture}/>
        <HomeButton />
        <MessagesButton count={0} />
        <GroupsButton />
        <LogoutButton />
      </div>
    </div>
  );
}

export default HeaderBar;
