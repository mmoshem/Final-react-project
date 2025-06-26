import React from 'react';
import './JoinedGroupsButton.css';

function JoinedGroupsButton({ isActive, onClick }) {
    return (
        <button 
            className={`filter-btn joined-groups-btn ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            Joined Groups
        </button>
    );
}

export default JoinedGroupsButton;