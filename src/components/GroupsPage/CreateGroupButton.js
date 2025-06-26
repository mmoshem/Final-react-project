import React from 'react';
import './CreateGroupButton.css';

function CreateGroupButton() {
    const handleCreateGroup = () => {
        // Future: Open modal/form for creating new group
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