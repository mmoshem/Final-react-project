import React, { useState, useEffect} from 'react';
import UserCard from './UserCard';
import './FollowersSection.css';
import axios from 'axios';

export default function FollowersSection({ followers, following, currentUserId, onRefresh }) {
  const [activeTab, setActiveTab] = useState('followers');
  const [followersData, setFollowersData] = useState([]);
  const [followingData, setFollowingData] = useState([]);
  console.log("👥 followers:", followers);
  console.log("➡️ following:", following);

  useEffect(() => {
  const fetchUsers = async (userIds) => {
    const users = await Promise.all(userIds.map(async (id) => {
      try {
        const res = await axios.get(`http://localhost:5000/api/userinfo/${id}`);
        return res.data;
      } catch (err) {
        console.error(`Failed to fetch user ${id}`, err);
        return null;
      }
    }));
    return users.filter(user => user !== null);
  };

  if (followers.length > 0) {
    fetchUsers(followers).then(setFollowersData);
  } else {
    setFollowersData([]);
  }

  if (following.length > 0) {
    fetchUsers(following).then(setFollowingData);
  } else {
    setFollowingData([]);
  }

}, [followers, following]);

const usersToDisplay = activeTab === 'followers' ? followersData : followingData;



  return (
    <div className="followers-section">
      <div className="followers-tabs">
        <button className={activeTab === 'followers' ? 'active' : ''} onClick={() => setActiveTab('followers')}>followers</button>
        <button className={activeTab === 'following' ? 'active' : ''} onClick={() => setActiveTab('following')}>following</button>
      </div>

     <div className="followers-grid">
  {usersToDisplay.length === 0 ? (
    <p>אין {activeTab === 'followers' ? 'followers' : 'following'} עדיין.</p>
  ) : (
    usersToDisplay.map((user) => {
  const userKey = typeof user === 'string' ? user : user.userId;
  return (
    <UserCard key={userKey} user={user} currentUserId={currentUserId} onRefresh={onRefresh} />
  );
         })
        )}
    </div>

    </div>
  );
}
