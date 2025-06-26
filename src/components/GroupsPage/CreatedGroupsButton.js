import React from 'react';
import './CreatedGroupsButton.css';

function CreatedGroupsButton({ isActive, onClick }) {
    return (
        <button 
            className={`filter-btn created-groups-btn ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            Created by You
        </button>
    );
}

export default CreatedGroupsButton;