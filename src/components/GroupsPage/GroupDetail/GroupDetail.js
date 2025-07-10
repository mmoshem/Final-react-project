import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import HeaderBar from '../../HeaderBar/HeaderBar';
import GroupHeader from './GroupHeader/GroupHeader';
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

    // Check if user is member or admin
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
                />
                
                <div className="group-content">
                    {/* Only show post composer to members/admin */}
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
                    
                    {/* Show posts to everyone (but only members can post) */}
                    <GroupAllPosts 
                        groupId={groupId}
                        refreshTrigger={refreshPosts}
                    />
                </div>
            </div>
        </div>
    );
}

export default GroupDetail;