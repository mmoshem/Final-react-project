// GroupDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HeaderBar from '../../HeaderBar/HeaderBar';
import GroupHeader from './GroupHeader/GroupHeader';
import GroupSettings from './GroupSettings';
import GroupPost from './GroupPost/GroupPost';
import GroupAllPosts from './GroupAllPosts/GroupAllPosts';
import './GroupDetail.css';
import axios from 'axios';

function GroupDetail() {
    const { groupId } = useParams();
    const userId = localStorage.getItem('userId');
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshPosts, setRefreshPosts] = useState(0);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        fetchGroupData();
    }, [groupId]);

    const fetchGroupData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/groups/${groupId}`);
            setGroup(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching group:', error);
            setError('Group not found');
            setLoading(false);
        }
    };

    const handlePostSuccess = () => {
        setRefreshPosts(prev => prev + 1);
    };

    const handleGroupUpdate = () => {
        fetchGroupData();
    };

    const isMember = group && group.members && group.members.some(member => 
        member._id === userId || member === userId
    );
    const isAdmin = group && group.creator && (
        group.creator._id === userId || group.creator === userId
    );
    const canPost = isMember || isAdmin;

    if (loading) {
        return (
            <div>
                <HeaderBar />
                <div className="group-detail-container">
                    <div className="loading-state">
                        <p>Loading group...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <HeaderBar />
                <div className="group-detail-container">
                    <div className="error-state">
                        <h2>Group Not Found</h2>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <HeaderBar />
            <div className="group-detail-container">
                <GroupHeader 
                    group={group} 
                    onGroupUpdate={handleGroupUpdate} 
                    onToggleSettings={() => setShowSettings(prev => !prev)}
                />

                {isAdmin && group.pendingRequests && group.pendingRequests.length > 0 && (
                    <div className="admin-join-requests-inbox" style={{margin: '24px 0', padding: '16px', background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '8px'}}>
                        <h3 style={{marginTop: 0}}>Join Requests</h3>
                        <ul style={{listStyle: 'none', padding: 0}}>
                            {group.pendingRequests.map((req, idx) => req.userId && (
                                <li key={req.userId._id || idx} style={{marginBottom: '12px', display: 'flex', alignItems: 'center'}}>
                                    <img src={req.userId.profilePicture || '/default-avatar.png'} alt="Profile" style={{width: 36, height: 36, borderRadius: '50%', marginRight: 12}} />
                                    <span style={{fontWeight: 600, marginRight: 8}}>{req.userId.name}</span>
                                    <span style={{color: '#888', fontSize: 13, marginRight: 16}}>{req.userId.email}</span>
                                    <span style={{color: '#aaa', fontSize: 12}}>{req.requestedAt ? new Date(req.requestedAt).toLocaleString() : ''}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {showSettings && (
                    <GroupSettings 
                        group={group} 
                        userId={userId} 
                        onGroupUpdated={fetchGroupData} 
                    />
                )}

                <div className="group-content">
                    {canPost ? (
                        <GroupPost 
                            groupId={groupId} 
                            onPostSuccess={handlePostSuccess}
                        />
                    ) : (
                        <div className="non-member-message">
                            <p>Join this group to share posts and participate in discussions!</p>
                        </div>
                    )}

                    <GroupAllPosts 
                        groupId={groupId}
                        refreshTrigger={refreshPosts}
                        canViewPosts={canPost}
                        isAdmin={isAdmin}
                    />
                </div>
            </div>
        </div>
    );
}

export default GroupDetail;
