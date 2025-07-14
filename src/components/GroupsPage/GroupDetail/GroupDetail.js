// Updated GroupDetail.js - Add the MembersDropdown component
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HeaderBar from '../../HeaderBar/HeaderBar';
import GroupHeader from './GroupHeader/GroupHeader';
import GroupSettings from './GroupSettings';
import GroupPost from './GroupPost/GroupPost';
import GroupAllPosts from './GroupAllPosts/GroupAllPosts';
import JoinRequestsDropdown from './JoinRequestsDropdown/JoinRequestsDropdown';
import MembersDropdown from './MembersDropdown/MembersDropdown'; // ✅ New import
import './GroupDetail.css';
import axios from 'axios';
import PostDummy from '../../Home/Posts/posting/PostDummy'
// import styles from '../../Home/Posts/posting/PostDummy.module.css';
import Modal from '../../Home/Posts/poststoshow/Modal'
import Post from '../../Home/Posts/posting/Post'
function GroupDetail() {
    const { groupId } = useParams();
    const userId = localStorage.getItem('userId');
    const profilePicture = localStorage.getItem('userProfileImage');
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshPosts, setRefreshPosts] = useState(0);
    const [showSettings, setShowSettings] = useState(false);
    const [processingRequests, setProcessingRequests] = useState(new Set());
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [postDummyClicked, setPostDummyClicked] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    useEffect(() => {
        fetchGroupData();
    }, [groupId]); // eslint-disable-line react-hooks/exhaustive-deps

    
    const fetchGroupData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:5000/api/groups/${groupId}`,
                { 
                    headers: token ? { 
                        'Authorization': `Bearer ${token}` 
                    } : {} 
                }
            );
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

    const handleMemberRemoved = (removedMember) => {
        // Refresh group data to update member count and other info
        fetchGroupData();
        console.log(`Member ${removedMember.displayName} was removed from the group`);
    };

    const handleApproveRequest = async (requestUserId) => {
        setProcessingRequests(prev => new Set([...prev, requestUserId]));
        try {
            const token = localStorage.getItem('token');
            console.log("FRONT AXIOS IN GROUPDEATAIL")
            await axios.post(
                `http://localhost:5000/api/groups/${groupId}/approve-request`, 
                { userId: requestUserId },
                { 
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    } 
                }
            );
            await fetchGroupData();
        } catch (error) {
            console.error('Error approving request:', error);
            alert('Failed to approve request: ' + (error.response?.data?.message || error.message));
        } finally {
            setProcessingRequests(prev => {
                const newSet = new Set(prev);
                newSet.delete(requestUserId);
                return newSet;
            });
        }
    };

    const handleRejectRequest = async (requestUserId) => {
        setProcessingRequests(prev => new Set([...prev, requestUserId]));
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:5000/api/groups/${groupId}/reject-request`, 
                { userId: requestUserId },
                { 
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    } 
                }
            );
            await fetchGroupData();
        } catch (error) {
            console.error('Error rejecting request:', error);
            alert('Failed to reject request: ' + (error.response?.data?.message || error.message));
        } finally {
            setProcessingRequests(prev => {
                const newSet = new Set(prev);
                newSet.delete(requestUserId);
                return newSet;
            });
        }
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

                {/* ✅ Dropdown Section - Both dropdowns side by side */}
                <div className="group-dropdowns" style={{ 
                    margin: '16px 0', 
                    display: 'flex', 
                    gap: '12px', 
                    flexWrap: 'wrap' 
                }}>
                    {/* Members Dropdown - Show only if user is a member OR if group is public */}
                    {(isMember || isAdmin || !group.isPrivate) && (
                        <MembersDropdown
                            groupId={groupId}
                            isAdmin={isAdmin}
                            currentUserId={userId}
                            onMemberRemoved={handleMemberRemoved}
                        />
                    )}

                    {/* Join Requests Dropdown - Only show to admin */}
                    {isAdmin && (
                        <JoinRequestsDropdown
                            pendingRequests={group.pendingRequests || []}
                            onApprove={handleApproveRequest}
                            onReject={handleRejectRequest}
                            processingRequests={processingRequests}
                        />
                    )}
                </div>

                {showSettings && (
                    <GroupSettings 
                        group={group} 
                        userId={userId} 
                        onGroupUpdated={fetchGroupData} 
                    />
                )}

                <div className="group-content">
                    {canPost ? (
                        <div>
                            <PostDummy setPostDummyClicked={setPostDummyClicked} profilePicture = {profilePicture}/>
                            { postDummyClicked &&(  
                                <Modal onClose={()=> setPostDummyClicked(false)} isLocked={isLocked}>
                                    <Post groupId={groupId} setIsLocked={setIsLocked} onPostSuccess={()=>setRefreshTrigger(prev => !prev)} onClose={()=> setPostDummyClicked(false)}  />
                                </Modal>
                            )}
                        </div>
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