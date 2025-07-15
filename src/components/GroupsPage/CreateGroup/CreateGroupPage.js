import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateGroupPage.css';
import HeaderBar from '../../HeaderBar/HeaderBar';
import GroupImageUpload from './GroupImageUpload';
import PrivacyToggle from './PrivacyToggle';
import GroupCreateButton from './GroupCreateButton';
import CancelButton from './CancelButton';
import axios from 'axios';

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
    const [isCreating, setIsCreating] = useState(false);
    const [uploadError, setUploadError] = useState('');

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
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setUploadError('Please select an image file');
                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setUploadError('Image must be less than 5MB');
                return;
            }

            setUploadError('');
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

    // Function to upload image to Cloudinary first
    const uploadImageToCloudinary = async (file, tempGroupId) => {
        if (!file) return null;

        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('groupId', tempGroupId); // Use temporary group ID

            const response = await axios.post(
                'http://localhost:5000/api/groups/upload-group-picture',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.success) {
                return response.data.url;
            } else {
                throw new Error(response.data.message || 'Image upload failed');
            }
        } catch (error) {
            console.error('Image upload error:', error);
            throw new Error('Failed to upload image');
        }
    };

    const handleSubmit = async () => {
        setIsCreating(true);
        setUploadError('');

        try {
            const userId = localStorage.getItem('userId');
            console.log("Current userId from localStorage:", userId);

            // Step 1: Create the group first without image
            const initialGroupData = {
                name: groupData.name,
                description: groupData.about,
                image: null, // No image initially
                isPrivate: groupData.isPrivate,
                userId: userId
            };

            console.log("POSTING initial group data:", initialGroupData);

            const groupResponse = await fetch('http://localhost:5000/api/groups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(initialGroupData)
            });

            if (!groupResponse.ok) {
                throw new Error('Failed to create group');
            }

            const newGroup = await groupResponse.json();
            console.log('Group created successfully:', newGroup);

            // Step 2: If there's an image, upload it and update the group
            if (groupData.image) {
                try {
                    console.log('Uploading image for group:', newGroup._id);
                    const imageUrl = await uploadImageToCloudinary(groupData.image, newGroup._id);
                    
                    if (imageUrl) {
                        // Update the group with the image URL
                        const updateResponse = await axios.put(
                            `http://localhost:5000/api/groups/${newGroup._id}`,
                            {
                                name: groupData.name,
                                description: groupData.about,
                                image: imageUrl,
                                isPrivate: groupData.isPrivate,
                                userId: userId
                            }
                        );
                        
                        console.log('Group updated with image:', updateResponse.data);
                    }
                } catch (imageError) {
                    console.error('Image upload failed:', imageError);
                    setUploadError('Group created but image upload failed. You can add an image later in group settings.');
                    // Don't fail the entire operation - group was created successfully
                }
            }

            alert('Group created successfully!');
            navigate('/GroupsPage?refresh=true');
        } catch (error) {
            console.error('Error creating group:', error);
            alert('Error creating group. Please try again.');
        } finally {
            setIsCreating(false);
        }
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

                        {/* Upload Error Message */}
                        {uploadError && (
                            <div className="upload-error-message">
                                {uploadError}
                            </div>
                        )}

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
                                isDisabled={!groupData.name.trim() || isCreating}
                                isLoading={isCreating}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateGroupPage;