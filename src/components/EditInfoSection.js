import React from "react";
import "./EditInfoSection.css";
import CancelButton from './CancelButton';
import SaveButton from './SaveButton';


export default function EditInfoSection() {
  return (
    <div className="edit-info-box">
      <h2>Edit Your Information</h2>
      <div className="form-grid">
        <div className="form-field">
          <label>First Name</label>
          <input type="text" placeholder="First Name" />
        </div>
        <div className="form-field">
          <label>Last Name</label>
          <input type="text" placeholder="Last Name" />
        </div>
        <div className="form-field full-width">
          <label>Professional Headline</label>
          <input type="text" placeholder="e.g., Software Engineer at TechCorp" />
          <small>0/120 characters</small>
        </div>
        <div className="form-field full-width">
          <label>About</label>
          <textarea placeholder="Write a brief summary about your professional background and interests..." />
          <small>0/2000 characters</small>
        </div>
        <div className="form-field">
          <label>Company</label>
          <input type="text" placeholder="Current company" />
        </div>
        <div className="form-field">
          <label>Position</label>
          <input type="text" placeholder="Current job title" />
        </div>
        <div className="form-field">
          <label>Location</label>
          <input type="text" placeholder="City, Country" />
        </div>
        <div className="form-field">
          <label>Industry</label>
          <input type="text" placeholder="e.g., Technology, Healthcare, Finance" />
        </div>
      </div>
      <hr className="divider" />
        <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <CancelButton />
            <SaveButton />
        </div>
    </div>
  );
}
