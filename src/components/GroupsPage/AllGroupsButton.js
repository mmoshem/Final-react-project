import React from 'react';
import './AllGroupsButton.css';

function AllGroupsButton({ isActive, onClick }) {
    return (
        <button 
            className={`filter-btn all-groups-btn ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            All Groups
        </button>
    );
}

export default AllGroupsButton;