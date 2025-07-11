import React from "react";
import "./InfoEntry.css";

export default function InfoEntry({
  name,
  startYear,
  endYear,
  nameLabel,
  startLabel,
  endLabel,
  nameField, 
  onChange,
  onDelete
}) {
  return (
    <div className="info-entry">
      <input
        type="text"
        placeholder={nameLabel}
        value={name}
        onChange={(e) => onChange(nameField, e.target.value)}
      />
      <input
        type="number"
        placeholder={startLabel}
        value={startYear || ""}
        onChange={(e) => onChange("startYear", e.target.value)}
      />
      <input
        type="number"
        placeholder={endLabel}
        value={endYear || ""}
        onChange={(e) => onChange("endYear", e.target.value)}
      />
      <button className="delete-button" onClick={onDelete}>✖️</button>
    </div>
  );
}
