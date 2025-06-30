import React, { useState, useEffect } from "react";
import "./EditInfoSection.css";
import CancelButton from './CancelButton';
import SaveButton from './SaveButton';
import InfoEntry from './InfoEntry';
import PrivacyToggle from './PrivacyToggle';

export default function EditInfoSection({ onSave, userInfo }) {
  const [educationEntries, setEducationEntries] = useState([0]);
  const [experienceEntries, setExperienceEntries] = useState([0]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState("");


   useEffect(() => {
    if (userInfo) {
      setFirstName(userInfo.first_name || "");
      setLastName(userInfo.last_name || "");
    }
  }, [userInfo]);

  const addEducationEntry = () => {
    setEducationEntries([...educationEntries, Date.now()]);
  };

  const removeEducationEntry = (idToRemove) => {
    setEducationEntries(educationEntries.filter((id) => id !== idToRemove));
  };

  const addExperienceEntry = () => {
    setExperienceEntries([...experienceEntries, Date.now()]);
  };

  const removeExperienceEntry = (idToRemove) => {
    setExperienceEntries(experienceEntries.filter((id) => id !== idToRemove));
  };

  return (
    <div className="edit-info-box">
      <h2>Edit Your Information</h2>
      <div className="form-grid">
        <div className="form-field">
          <label>First Name</label>
          <input type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="your first name" />
        </div>
        <div className="form-field">
          <label>Last Name</label>
          <input type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="your last name" />
        </div>
        <div className="form-field">
          <label>Gender</label>
          <select>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
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
          <label>Date of Birth</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input type="number" placeholder="Day" min="1" max="31" />
            <input type="number" placeholder="Month" min="1" max="12" />
            <input type="number" placeholder="Year" min="1900" max={new Date().getFullYear()} />
          </div>
        </div>

        <div className="form-field">
          <label>Position</label>
          <input type="text" placeholder="Current job title" />
        </div>
        <div className="form-field">
          <label>Location</label>
          <input type="text" placeholder="City" />
          <input type="text" placeholder="Country" />
        </div>

      <PrivacyToggle isChecked={isPrivate} onToggle={() => setIsPrivate(!isPrivate)}label="Private Profile"/>

        <div className="form-field full-width">
          <label>Education</label>
          {educationEntries.map((id) => (
            <InfoEntry
              key={id}
              nameLabel="University"
              startLabel="Start Year"
              endLabel="End Year"
              onDelete={() => removeEducationEntry(id)}
            />
          ))}
          <button onClick={addEducationEntry} className="add-entry-btn">+ Add Education</button>
        </div>
        <div className="form-field full-width">
          <label>Experience</label>
          {experienceEntries.map((id) => (
            <InfoEntry
              key={id}
              nameLabel="Company Name"
              startLabel="Start Year"
              endLabel="End Year"
              onDelete={() => removeExperienceEntry(id)}
            />
          ))}
          <button onClick={addExperienceEntry} className="add-entry-btn">+ Add Experience</button>
        </div>
      </div>

      <hr className="divider" />
      <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
        <CancelButton />
        <SaveButton onClick={() => onSave({ first_name: firstName, last_name: lastName, location })} />
      </div>
    </div>
  );
}
