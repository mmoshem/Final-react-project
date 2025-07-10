import React from 'react';
import JoinButton from '../JoinButton/joinButton';
import './GroupCard.css';

function GroupCard({ 
    group, 
    onJoinClick, 
    onCardClick, 
    isJoining = false,
    variant = "grid" // "grid" or "list"
}) {
    const truncateText = (text, maxLength = 10000) => {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    const handleJoinClick = (e) => {
        e.stopPropagation(); // Prevent card click when joining
        if (onJoinClick) {
            onJoinClick(group._id);
        }
    };

    const handleCardClick = () => {
        if (onCardClick) {
            onCardClick(group._id);
        }
    };

    if (variant === "list") {
        return (
            <div 
                className="group-result-card" 
                onClick={handleCardClick}
                style={{ cursor: onCardClick ? 'pointer' : 'default' }}
            >
                <div className="group-info">
                    <h4>{group.name}</h4>
                    <p>{truncateText(group.description)}</p>
                    <span className="member-count">{group.memberCount || 0} members</span>
                </div>
                <JoinButton
                    onClick={handleJoinClick}
                    isLoading={isJoining}
                />
            </div>
        );
    }

    return (
        <div 
            className="group-card" 
            onClick={handleCardClick}
            style={{ cursor: onCardClick ? 'pointer' : 'default' }}
        >
            <h4>{group.name}</h4>
            <p>{truncateText(group.description)}</p>
            <span>{group.memberCount || 0} members</span>
            <JoinButton
                onClick={handleJoinClick}
                isLoading={isJoining}
                className="group-card-join-btn"
            />
        </div>
    );
}

export default GroupCard;