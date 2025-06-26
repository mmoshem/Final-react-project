import React from "react";
import "./InfoEntry.css";

export default function InfoEntry({ nameLabel, startLabel, endLabel, onDelete }) {
  return (
    <div className="info-entry">
      <input type="text" placeholder={nameLabel} />
      <input type="number" placeholder={startLabel} />
      <input type="number" placeholder={endLabel} />
      <button className="delete-button" onClick={onDelete}>❌</button>
    </div>
  );
}
