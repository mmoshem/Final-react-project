import React, { useState, useEffect } from "react";
import "./EditInfoSection.css";
import CancelButton from './CancelButton';
import SaveButton from './SaveButton';
import InfoEntry from './InfoEntry';
import PrivacyToggle from './PrivacyToggle';

function isValidDate(year, month, day) {
  const y = parseInt(year);
  const m = parseInt(month) - 1; 
  const d = parseInt(day);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return false;
  if (y < 1925 || y > 2010) return false;
  const date = new Date(y, m, d);
  return (
    date.getFullYear() === y &&
    date.getMonth() === m &&
    date.getDate() === d
  );
}


export default function EditInfoSection({ onSave, userInfo,onCancel }) {
  const [educationEntries, setEducationEntries] = useState([0]);
  const [experienceEntries, setExperienceEntries] = useState([0]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [position, setPosition]=useState("");
  const [gender,setGender]=useState("");
  const [headline,setHeadline]=useState("");
  const [about,setAbout]=useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");
  


   useEffect(() => {
    if (userInfo) {
      setFirstName(userInfo.first_name || "");
      setLastName(userInfo.last_name || "");
      setPosition(userInfo.position || "");
      setHeadline(userInfo.headline || "");
      setAbout(userInfo.about || "");
      setGender(userInfo.gender || "");
      setIsPrivate(userInfo.isPrivate || false);

      if (userInfo.location) {
        setCity(userInfo.location.city || '');
        setCountry(userInfo.location.country || '');
      }
      if (userInfo.birthDate) {
        const date = new Date(userInfo.birthDate);
        setBirthDay(String(date.getDate()).padStart(2, '0'));
        setBirthMonth(String(date.getMonth() + 1).padStart(2, '0')); 
        setBirthYear(String(date.getFullYear()));
    }
      
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
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
        </div>
        <div className="form-field full-width">
          <input
            type="text"
            placeholder="e.g., Software Engineer at TechCorp"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            maxLength={120}
          />
          <small>{headline.length}/120 characters</small>
        </div>
        <div className="form-field full-width">
          <label>About</label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Write a brief summary about your professional background and interests..."
              maxLength={2000}
            />
            <small>{about.length}/2000 characters</small>
        </div>

        <div className="form-field">
          <label>Date of Birth</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="number"
              placeholder="Day"
              min="1"
              max="31"
              value={birthDay}
              onChange={(e) => setBirthDay(e.target.value)}
            />
            <input
              type="number"
              placeholder="Month"
              min="1"
              max="12"
              value={birthMonth}
              onChange={(e) => setBirthMonth(e.target.value)}
            />
            <input
              type="number"
              placeholder="Year"
              min="1900"
              max={new Date().getFullYear()}
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
            />
            </div>
        </div>

        <div className="form-field">
          <label>Position</label>
            <input
              type="text"
              placeholder="Current job title"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
        </div>
        <div className="form-field">
          <label>Location</label>
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
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
        <CancelButton onClick={onCancel} />
        <SaveButton onClick={() => {
            if (!isValidDate(birthYear, birthMonth, birthDay)) {
              alert("Please enter a valid birth date");
              return;
            }

            const birthDate = new Date(
              `${birthYear.padStart(4, '0')}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`
            );

            onSave({
              first_name: firstName,
              last_name: lastName,
              position,
              headline,
              gender,
              about,
              isPrivate,
              birthDate,
               location: {
                city,
                country
              }
            });
          }} />
      </div>
    </div>
  );
}
