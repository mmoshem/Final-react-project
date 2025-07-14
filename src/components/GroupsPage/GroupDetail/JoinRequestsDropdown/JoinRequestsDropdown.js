// JoinRequestsDropdown.js - Create this new component
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './JoinRequestsDropdown.css';

function JoinRequestsDropdown({ 
    pendingRequests, 
    onApprove, 
    onReject, 
    processingRequests 
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`);
        setIsOpen(false);
    };

    if (!pendingRequests || pendingRequests.length === 0) {
        return null;
    }

    return (
        <div className="join-requests-dropdown" ref={dropdownRef}>
            <button 
                className="dropdown-trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="icon">👥</span>
                <span>Join Requests</span>
                <span className="badge">{pendingRequests.length}</span>
                <span className="arrow">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <div className="dropdown-content">
                    <div className="dropdown-header">
                        <h4>Pending Join Requests</h4>
                    </div>
                    
                    <div className="requests-list">
                        {pendingRequests.map((req, idx) => {
                            const user = req.userId && typeof req.userId === 'object' ? req.userId : null;
                            const userId = req.userId && typeof req.userId === 'string' ? req.userId : req.userId?._id;
                            
                            if (!user && !userId) return null;

                            const isProcessing = processingRequests.has(user?._id || userId);
                            const displayName = user?.displayName || user?.email || 'Unknown User';
                            const email = user?.email || '';
                            const profilePicture = user?.profilePicture || '/default-avatar.png';
                            
                            return (
                                <div key={user?._id || userId || idx} className="request-item">
                                    <div 
                                        className="user-info"
                                        onClick={() => handleUserClick(user?._id || userId)}
                                    >
                                        <img 
                                            src={profilePicture} 
                                            alt="Profile" 
                                            className="user-avatar"
                                            onError={e => {
                                                if (!e.target.src.endsWith('/default-avatar.png')) {
                                                    e.target.src = '/default-avatar.png';
                                                }
                                            }}
                                        />
                                        <div className="user-details">
                                            <div className="user-name">
                                                {displayName}
                                            </div>
                                            <div className="user-email">
                                                {email}
                                            </div>
                                            <div className="request-time">
                                                {req.requestedAt ? 
                                                    new Date(req.requestedAt).toLocaleDateString() : 
                                                    'Unknown date'
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="action-buttons">
                                        <button
                                            className="accept-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onApprove(user?._id || userId);
                                            }}
                                            disabled={isProcessing}
                                            title="Accept request"
                                        >
                                            ✓
                                        </button>
                                        <button
                                            className="reject-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onReject(user?._id || userId);
                                            }}
                                            disabled={isProcessing}
                                            title="Reject request"
                                        >
                                            ✗
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default JoinRequestsDropdown;