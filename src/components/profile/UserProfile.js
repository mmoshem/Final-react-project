import React, { useEffect, useState } from "react";
import axios from "axios";
import HeaderBar from "../HeaderBar/HeaderBar";
import ProfileBox from "./ProfileBox"; 
import ProfileTabs from "./ProfileTabs";
import AboutSection from "./AboutSection";      
import PostsSection from "./PostsSection";    
import StatisticsSection from "./StatisticsSection";
import { useParams } from "react-router-dom";

export default function UserProfile() {
  const [viewedUserInfo, setViewedUserInfo] = useState(null);
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");

  const { id } = useParams();
  const currentUserId = localStorage.getItem("userId");
  const viewedUserId = id || currentUserId;

  useEffect(() => {
    const fetchViewedUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/userinfo/${viewedUserId}`);
        setViewedUserInfo(response.data);
      } catch (err) {
        console.error("Failed to load viewed user info:", err);
      }
    };

    fetchViewedUser();
  }, [viewedUserId]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/userinfo/${currentUserId}`);
        setCurrentUserInfo(response.data);
      } catch (err) {
        console.error("Failed to load current user info:", err);
      }
    };

    fetchCurrentUser();
  }, [currentUserId]);

  return (
    <div>
      {/* תצוגת Header תמיד לפי המשתמש המחובר */}
      <HeaderBar profilePicture={currentUserInfo?.profilePicture} />

      {/* שאר הקומפוננטות לפי המשתמש שצופים בו */}
      {viewedUserInfo && (
        <>
          <ProfileBox user={viewedUserInfo} currentUserId={currentUserId}/>
          <ProfileTabs onTabChange={setActiveTab} />

          {activeTab === "posts" && <PostsSection userId={viewedUserInfo.userId} />}
          {activeTab === "about" && <AboutSection userInfo={viewedUserInfo} />}
          {activeTab === "statistics" && <StatisticsSection userId={viewedUserInfo.userId} />}
        </>
      )}
    </div>
  );
}
