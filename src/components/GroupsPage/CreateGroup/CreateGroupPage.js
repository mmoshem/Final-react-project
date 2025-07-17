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
    const [groupData, setGroupData] = useState({ // פרמטרים של קבוצה ופונקציה שמשנה אותם 
        name: '',
        about: '',
        isPrivate: false,
        image: null
    });

    const [imagePreview, setImagePreview] = useState(null); // תצוגה מקדימה לתמונה
    const [isCreating, setIsCreating] = useState(false); //  האם תהליך יצירת הקבוצה רץ ברקע
    const [uploadError, setUploadError] = useState('');  // האם יש שגיאה בהעלאת תמונה

    const handleInputChange = (e) => { // בעת שינוי שם מעדכן את השם או אודות החדש
        const { name, value } = e.target;
        setGroupData(prev => ({
            ...prev, // שומר את הפרטים שנשמרו ולא הוחלפו ממקודם
            [name]: value
        }));
    };

    const handleImageUpload = (e) => { // מתמודד עם שינוי או העלאה של תמונה 
        const file = e.target.files[0]; // תמיד מערך לאפשר למשתמש כמה קבצים שירצה בעתיד 
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) { // לוודא שמדובר בתמונה
                setUploadError('Please select an image file');
                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {  // תמונה קטנה גודל סטנדרטי לאפליקציה שלנו 
                setUploadError('Image must be less than 5MB');
                return;
            }

            setUploadError(''); // מנקה שגיאות קודמות כשבוחר קובץ חדש 
            setGroupData(prev => ({ ...prev, image: file })); // שומר את שאר הדאטה שהיה על הקבוצה לפני השגיאה- שם אודות וכו ...prev

            // Create preview
            const reader = new FileReader();// מאפשר לקרוא תמונה כקובץ טקסט
            reader.onload = (e) => setImagePreview(e.target.result); // קורא את הקובץ והופך לכתובת של תמונה 
            reader.readAsDataURL(file); // שומרים את הכתובת המוכנה
        }
    };

    const handlePrivacyChange = (isPrivate) => { // מעדכן את הפרטיות תוך שמירה על מה שהיה עד כה 
        setGroupData(prev => ({ ...prev, isPrivate }));
    };

    // Function to upload image to Cloudinary first
    const uploadImageToCloudinary = async (file, tempGroupId) => { //  פונקציה אסינכרונית פועלת רק אם יש תמונה, שולחת  תמונה לשרת 
        if (!file) return null; // אם אין תמונה אין מה לעשות

        try { // בונה טופס שהשרת יוכל לעבוד איתו - קובץ עם טקסט וקובץ, מנותח בבאקאנד
            const formData = new FormData();
            formData.append('image', file);
            formData.append('groupId', tempGroupId); // Use temporary group ID כי הקבוצה כביכול לא נוצרה רק נשלחה לשרת 

            const response = await axios.post( // שליחה לשרת את הקובץ שיצרנו שיתאים לבקשת הHTTP 
                'http://localhost:5000/api/groups/upload-group-picture',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data', // מגדיר את סוג הבקשה והטופס ששלחנו שזה קובץ תמונה
                    },
                }
            );

            if (response.data.success) { // אם השליחה בוצעה בהצלחה - השרת עונה עם אובייקט json עם כתובת התמונה 
                return response.data.url;
            } else {
                throw new Error(response.data.message || 'Image upload failed'); // אם השרת כשל תעדכן שנכשל 
            }
        } catch (error) { // בעיה כללית תיתפס בcatch  
            console.error('Image upload error:', error);
            throw new Error('Failed to upload image');
        }
    };

    const handleSubmit = async () => {
        setIsCreating(true); // הקבוצה בתהליך יצירה 
        setUploadError(''); // ניקוי המצב הנוכחי 

        try {
            const userId = localStorage.getItem('userId'); // מביא את היוזר איידי מתוך האחסון המקומי כדי לשייך יוזר לקבוצה שלו והיוזר כבר יצר אז זה נשמר
            console.log("Current userId from localStorage:", userId);

            // Step 1: Create the group first without image לתמונה יש טיפול מיוחד
            const initialGroupData = { 
                name: groupData.name,
                description: groupData.about,
                image: null, // No image initially
                isPrivate: groupData.isPrivate,
                userId: userId
            };

            console.log("POSTING initial group data:", initialGroupData); 

            const groupResponse = await fetch('http://localhost:5000/api/groups', { // פנייה לשרת ליצור את הקבוצה במונגו ע"י קובץ ג'ייסון 
                method: 'POST', // בקשה מסוג פוסט
                headers: {
                    'Content-Type': 'application/json', // מה התוכן 
                },
                body: JSON.stringify(initialGroupData)// התוכן עצמו בסטרינג שHTTP יוכל לקרוא 
            });

            if (!groupResponse.ok) { // חזרה של שגיאה
                throw new Error('Failed to create group');
            }

            const newGroup = await groupResponse.json(); // לא קרתה שגיאה- מדפיס לקונסול את הקבוצה החדשה
            console.log('Group created successfully:', newGroup);

            // Step 2: If there's an image, upload it and update the group
            if (groupData.image) {
                try {
                    console.log('Uploading image for group:', newGroup._id);
                    const imageUrl = await uploadImageToCloudinary(groupData.image, newGroup._id); // שולח את הקובץ לשרת שיעלה לדיבי- יחזיר קובץ URL 
                    
                    if (imageUrl) { // אם התקבל url 
                        // Update the group with the image URL
                        const updateResponse = await axios.put( // עכשיו צריך לעדכן את הקבוצה עם בקשת PUT
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

            alert('Group created successfully!'); // אם הצליח 
            navigate('/GroupsPage?refresh=true'); // נווט לקבוצה ורפרש את הדף לעדכון 
        } catch (error) {
            console.error('Error creating group:', error);
            alert('Error creating group. Please try again.');
        } finally {
            setIsCreating(false); // כשהפעולה הסתיימה אם בכישלון או בהצלחה - שלא יישאר עדיין ביצירת קבוצה 
        }
    };

    const handleCancel = () => {
        navigate('/GroupsPage'); // אם לחצנו על ביטול, חזור לדף הראשי 
    };

    return ( // החלק שמרנדר את הממשק למשתמש 
        <div> 
            <HeaderBar /> {/* ההדר שלנו בתחילת כל דף */}
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

                        {/* Button Components -אם אין שם חוקי\עדיין ביצירה אל תאפשר ללחוץ על כפתור,כפתור ביטול לר צריך להיחסם רק כפתור יצירה */} 
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