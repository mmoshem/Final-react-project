// components/profile/ProfileTabs.js
import React from "react";
import "./ProfileTabs.css";

export default function ProfileTabs({ onTabChange }) {
  const [activeTab, setActiveTab] = React.useState("posts");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="tabs-container">
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
        className={`tab-item ${activeTab === "statistics" ? "active" : ""}`}
        onClick={() => handleTabClick("statistics")}
      >
        Statistics
      </div>
    </div>
  );
}
