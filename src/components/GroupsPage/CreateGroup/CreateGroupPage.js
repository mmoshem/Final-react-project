import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateGroupPage.css';
import HeaderBar from '../../HeaderBar/HeaderBar';
import GroupImageUpload from './GroupImageUpload';
import PrivacyToggle from './PrivacyToggle';
import GroupCreateButton from './GroupCreateButton';
import CancelButton from './CancelButton';

function CreateGroupPage() {
    const navigate = useNavigate();
    
    // Form state
    const [groupData, setGroupData] = useState({
        name: '',
        about: '',
        isPrivate: false,
        image: null
    });
    
    const [imagePreview, setImagePreview] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGroupData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setGroupData(prev => ({ ...prev, image: file }));
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handlePrivacyChange = (isPrivate) => {
        setGroupData(prev => ({ ...prev, isPrivate }));
    };

    const handleSubmit = () => {
        // Future: API call to create group
        console.log('Creating group:', groupData);
        alert('Group created! (This will be connected to backend later)');
        navigate('/GroupsPage');
    };

    const handleCancel = () => {
        navigate('/GroupsPage');
    };

    return (
        <div>
            <HeaderBar />
            <div className="create-group-container">
                <div className="create-group-card">
                    <div className="page-header">
                        <h1>Create New Group</h1>
                        <p>Build a community around your interests</p>
                    </div>

                    <div className="create-group-form">
                        {/* Group Image Upload Component */}
                        <GroupImageUpload 
                            imagePreview={imagePreview}
                            onImageUpload={handleImageUpload}
                        />

                        {/* Group Name */}
                        <div className="form-section">
                            <label htmlFor="group-name" className="form-label">
                                Group Name *
                            </label>
                            <input
                                type="text"
                                id="group-name"
                                name="name"
                                value={groupData.name}
                                onChange={handleInputChange}
                                placeholder="Enter group name"
                                className="form-input"
                                required
                            />
                        </div>

                        {/* About Section */}
                        <div className="form-section">
                            <label htmlFor="group-about" className="form-label">
                                About This Group
                            </label>
                            <textarea
                                id="group-about"
                                name="about"
                                value={groupData.about}
                                onChange={handleInputChange}
                                placeholder="What's this group about? What will members discuss?"
                                className="form-textarea"
                                rows={4}
                            />
                        </div>

                        {/* Privacy Toggle Component */}
                        <PrivacyToggle 
                            isPrivate={groupData.isPrivate}
                            onPrivacyChange={handlePrivacyChange}
                        />

                        {/* Button Components */}
                        <div className="form-actions">
                            <CancelButton onCancel={handleCancel} />
                            <GroupCreateButton 
                                onSubmit={handleSubmit}
                                isDisabled={!groupData.name.trim()}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateGroupPage;