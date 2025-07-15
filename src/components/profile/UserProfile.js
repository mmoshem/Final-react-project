import React, { useEffect, useState,useCallback } from "react";
import axios from "axios";
import HeaderBar from "../HeaderBar/HeaderBar";
import ProfileBox from "./ProfileBox"; 
import ProfileTabs from "./ProfileTabs";
import AboutSection from "./AboutSection";      
import PostsSection from "./PostsSection";    
import StatisticsSection from "./StatisticsSection";
import { useParams } from "react-router-dom";
import FollowersSection from "./FollowersSection";


export default function UserProfile() {
  const [viewedUserInfo, setViewedUserInfo] = useState(null);
  const [currentUserInfo, setCurrentUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const { id } = useParams();
  const currentUserId = localStorage.getItem("userId");
  const viewedUserId = id || currentUserId;
  const [refreshKey, setRefreshKey] = useState(0);


    const fetchViewedUser = useCallback(async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/userinfo/${viewedUserId}`);
        setViewedUserInfo(response.data);
        } catch (err) {
          console.error("Failed to load viewed user info:", err);
        }
      }, [viewedUserId]);


  useEffect(() => {
    fetchViewedUser();
  }, [fetchViewedUser,refreshKey]);

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

   useEffect(() => {
    const fetchFollowersAndFollowing = async () => {
      try {
        const [followersRes, followingRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/userinfo/${viewedUserId}/followers`),
          axios.get(`http://localhost:5000/api/userinfo/${viewedUserId}/following`)
        ]);
        setFollowers(followersRes.data);
        setFollowing(followingRes.data);
      } catch (err) {
        console.error("Error loading followers/following", err);
      }
    };

    if (viewedUserId) {
      fetchFollowersAndFollowing();
    }
  }, [viewedUserId, refreshKey]);

const isOwnProfile = currentUserId === viewedUserId;

// Add a handler to refresh posts every time the posts tab is activated
const handleTabChange = (tab) => {
  setActiveTab(tab);
  if (tab === "posts") {
    setRefreshKey(prev => prev + 1);
  }
};

useEffect(() => {
  setActiveTab("posts");
}, [viewedUserId]);

  return (
    <div>
      <HeaderBar profilePicture={currentUserInfo?.profilePicture} />
      {viewedUserInfo && (
        <>
          <ProfileBox user={viewedUserInfo} currentUserId={currentUserId} onRefresh={() => setRefreshKey(prev => prev + 1)}/>
          <ProfileTabs activeTab={activeTab} onTabChange={handleTabChange} isOwnProfile={isOwnProfile}/>
          {activeTab === "posts" && <PostsSection userId={viewedUserInfo.userId} refreshTrigger={refreshKey} />}
          {activeTab === "about" && <AboutSection userInfo={viewedUserInfo} />}
          {activeTab === "friends" && <FollowersSection
              followers={viewedUserInfo.followers}
              following={viewedUserInfo.followingUsers}
              currentUserId={currentUserId}
              onRefresh={() => setRefreshKey(prev => prev + 1)}
            />
          }
          {activeTab === "statistics" && isOwnProfile && <StatisticsSection userId={currentUserId} />}
        </>
      )}
    </div>
  );
}
