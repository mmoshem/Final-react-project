// components/profile/ProfileTabs.js
import React from "react";
import "./ProfileTabs.css";

export default function ProfileTabs({ onTabChange ,isOwnProfile}) {
  const [activeTab, setActiveTab] = React.useState("posts");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <div  className={`tabs-container ${isOwnProfile ? 'four-tabs' : 'three-tabs'}`}>
      <div
        className={`tab-item ${activeTab === "about" ? "active" : ""}`}
        onClick={() => handleTabClick("about")}
      >
        About
      </div>
      <div
        className={`tab-item ${activeTab === "posts" ? "active" : ""}`}
        onClick={() => handleTabClick("posts")}
      >
        Posts
      </div>
      <div
        className={`tab-item ${activeTab === "friends" ? "active" : ""}`}
        onClick={() => handleTabClick("friends")}
      >
        Friends
      </div>
      {isOwnProfile && (
        <div
          className={`tab-item ${activeTab === 'statistics' ? 'active' : ''}`}
          onClick={() => handleTabClick('statistics')}
        >
          Statistics
        </div>
      )}
    </div>
  );
}
