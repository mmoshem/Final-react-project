import React from 'react';
import './CreateGroupButton.css';
import { Navigate, useNavigate } from 'react-router-dom';
function CreateGroupButton() {
    const navigate = useNavigate();
    const handleCreateGroup = () => {
        // Future: Open modal/form for creating new group
        navigate('/groups/create');
        console.log("Create group clicked - will open modal later");
    };

    return (
        <button 
            className="create-group-btn"
            onClick={handleCreateGroup}
        >
            <span className="btn-icon">+</span>
            Create Group
        </button>
    );
}

export default CreateGroupButton;