import React, { useEffect, useState } from "react";
import axios from "axios";
import HeaderBar from "../HeaderBar/HeaderBar";
import ProfileBox from "./ProfileBox"; 
import ProfileTabs from "./ProfileTabs";
import AboutSection from "./AboutSection";      
import PostsSection from "./PostsSection";    
import StatisticsSection from "./StatisticsSection";

//import UserInfo from "./UserInfo";


export default function UserProfile() {
  const userId = localStorage.getItem("userId");
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("posts"); 

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/userinfo/${userId}`);
        setUserInfo(response.data);
      } catch (err) {
        console.error("Failed to load user info:", err);
      }
    };
    fetchUserInfo();
  }, [userId]);

  return (
    <div>
      <HeaderBar profilePicture={userInfo?.profilePicture} />
      {userInfo && (
        <>
          <ProfileBox user={userInfo} />
          <ProfileTabs onTabChange={setActiveTab} />

          {activeTab === "posts" && <PostsSection userId={userId} />}
          {activeTab === "about" && <AboutSection userInfo={userInfo} />}
          {activeTab === "statistics" && <StatisticsSection userId={userId} />}
        </>
      )}
    </div>
  );
}
