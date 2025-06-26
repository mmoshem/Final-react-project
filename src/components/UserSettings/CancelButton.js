import React from 'react';
import './CancelButton.css';

export default function CancelButton() {
  return (
    <button className="cancel-button">
      <span className="icon">&#10005;</span> Cancel
    </button>
  );
}
