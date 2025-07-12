import React, { useState, useEffect } from 'react';
import UserCard from './UserCard';
import './FollowersSection.css';
import axios from 'axios';

export default function FollowersSection({ followers, following, currentUserId, onRefresh }) {
  const [activeTab, setActiveTab] = useState('followers');
  const [followersData, setFollowersData] = useState([]);
  const [followingData, setFollowingData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchUsers = async (userIds) => {
      const users = await Promise.all(
        userIds.map(async (id) => {
          try {
            const res = await axios.get(`http://localhost:5000/api/userinfo/${id}`);
            return res.data;
          } catch (err) {
            console.error(`Failed to fetch user ${id}`, err);
            return null;
          }
        })
      );
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

    setCurrentPage(0); 
  }, [followers, following, activeTab]);

  const usersToDisplay = activeTab === 'followers' ? followersData : followingData;

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = usersToDisplay.slice(startIndex, endIndex);
  const totalPages = Math.ceil(usersToDisplay.length / itemsPerPage);

  return (
    <div className="followers-section">
      <div className="followers-tabs">
        <button
          className={activeTab === 'followers' ? 'active' : ''}
          onClick={() => setActiveTab('followers')}
        >
          followers
        </button>
        <button
          className={activeTab === 'following' ? 'active' : ''}
          onClick={() => setActiveTab('following')}
        >
          following
        </button>
      </div>

      <div className="followers-grid">
        {paginatedUsers.length === 0 ? (
           <p>No {activeTab === 'followers' ? 'followers' : 'following'} yet.</p>
        ) : (
          paginatedUsers.map((user) => {
            const userKey = typeof user === 'string' ? user : user.userId;
            return (
              <UserCard
                key={userKey}
                user={user}
                currentUserId={currentUserId}
                onRefresh={onRefresh}
              />
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
          >
            ←
          </button>
          <span>page {currentPage + 1} from {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
            disabled={currentPage === totalPages - 1}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
