import React from 'react';
import './GroupCreateButton.css';

function GroupCreateButton({ onSubmit, isDisabled }) {
    return (
        <button
            type="button"
            onClick={onSubmit}
            className="create-button"
            disabled={isDisabled}
        >
            Create Group
        </button>
    );
}

export default GroupCreateButton;