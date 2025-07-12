// GroupHeader.js
import React, { useState } from 'react';
import axios from 'axios';
import './GroupHeader.css';

function GroupHeader({ group, onGroupUpdate, onToggleSettings }) {
    const userId = localStorage.getItem('userId');
    const [isJoining, setIsJoining] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false);

    const isMember = group.members && group.members.some(member => 
        (member && member._id && member._id.toString() === userId) ||
        (member && member.toString() === userId)
    );

    const isAdmin = group.creator && (
        (group.creator._id && group.creator._id.toString() === userId) ||
        (group.creator && group.creator.toString() === userId)
    );

    const hasPendingRequest = group.pendingRequests && group.pendingRequests.some(req => {
        if (!req || !req.userId) return false;
        return (req.userId._id && req.userId._id.toString() === userId) ||
               (typeof req.userId === 'string' && req.userId === userId);
    });

    const handleJoinGroup = async () => {
        if (group.isPrivate) {
            setIsRequesting(true);
            try {
                await axios.post(`http://localhost:5000/api/groups/${group._id}/request`, { userId });
                onGroupUpdate();
                alert('Join request sent! You will be notified when the admin responds.');
            } catch (error) {
                console.error('Error requesting to join group:', error);
                alert('Failed to send join request');
            } finally {
                setIsRequesting(false);
            }
        } else {
            setIsJoining(true);
            try {
                await axios.post(`http://localhost:5000/api/groups/${group._id}/join`, { userId });
                onGroupUpdate();
            } catch (error) {
                console.error('Error joining group:', error);
                alert('Failed to join group');
            } finally {
                setIsJoining(false);
            }
        }
    };

    const handleLeaveGroup = async () => {
        setIsLeaving(true);
        try {
            await axios.post(`http://localhost:5000/api/groups/${group._id}/leave`, { userId });
            onGroupUpdate();
        } catch (error) {
            console.error('Error leaving group:', error);
            alert('Failed to leave group');
        } finally {
            setIsLeaving(false);
        }
    };

    const handleCancelRequest = async () => {
        setIsRequesting(true);
        try {
            await axios.post(`http://localhost:5000/api/groups/${group._id}/cancel-request`, { userId });
            onGroupUpdate();
        } catch (error) {
            console.error('Error canceling request:', error);
            alert('Failed to cancel request. Please try again.');
        } finally {
            setIsRequesting(false);
        }
    };

    const getJoinButtonText = () => {
        if (group.isPrivate) {
            return isRequesting ? 'Sending Request...' : 'Request to Join';
        }
        return isJoining ? 'Joining...' : 'Join Group';
    };

    return (
        <div className="group-header">
            <div className="group-info">
                <div className="group-title">
                    <h1>{group.name}</h1>
                    {group.isPrivate && (
                        <span className="private-badge">🔒 Private</span>
                    )}
                </div>

                {group.description && (
                    <p className="group-description">{group.description}</p>
                )}

                <div className="group-stats">
                    <span className="member-count">
                        {group.memberCount || 0} members
                    </span>
                    <span className="created-date">
                        Created {new Date(group.createdAt).toLocaleDateString()}
                    </span>
                    {group.creator && (
                        <span className="creator-info">
                            Created by {group.creator.name || 'Unknown'}
                        </span>
                    )}
                </div>
            </div>

            <div className="group-actions">
                {isAdmin && (
                    <button onClick={onToggleSettings} className="settings-button">
                        ⚙️ Settings
                    </button>
                )}

                {isMember && !isAdmin && (
                    <button 
                        onClick={handleLeaveGroup} 
                        className="leave-button"
                        disabled={isLeaving}
                    >
                        {isLeaving ? 'Leaving...' : 'Leave Group'}
                    </button>
                )}

                {!isMember && !isAdmin && !hasPendingRequest && (
                    <button 
                        onClick={handleJoinGroup} 
                        className={`join-button ${group.isPrivate ? 'request-button' : ''}`}
                        disabled={isJoining || isRequesting}
                    >
                        {getJoinButtonText()}
                    </button>
                )}

                {!isMember && !isAdmin && hasPendingRequest && (
                    <div className="pending-request">
                        <span className="pending-text">Request Pending</span>
                        <button 
                            onClick={handleCancelRequest} 
                            className="cancel-request-button"
                            disabled={isRequesting}
                        >
                            {isRequesting ? 'Canceling...' : 'Cancel Request'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GroupHeader;
