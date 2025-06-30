import React from 'react';
import './CancelButton.css';

function CancelButton({ onCancel }) {
    return (
        <button
            type="button"
            onClick={onCancel}
            className="cancel-button"
        >
            Cancel
        </button>
    );
}

export default CancelButton;