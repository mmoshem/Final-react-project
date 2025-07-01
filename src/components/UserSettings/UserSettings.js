import {  useEffect,useState } from "react";
import HeaderBar from "../HeaderBar/HeaderBar";
import ProfilePhotoField from "./ProfilePhotoField";
import EditInfoSection from './EditInfoSection';
import axios from "axios";

export default function UserSettings() {
  const userId = localStorage.getItem('userId');
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/userinfo/${userId}`);
      setUserInfo(response.data);
      setPreviewImage(response.data.profilePicture || '/images/default-profile.png'); 
    } catch (err) {
      console.error("Failed to fetch user info", err);
    }
  };


  useEffect(() => {
    fetchUserInfo();
  }, []);

 const handleSave = async (formFields) => {
  console.log("Saving form fields:", formFields);

  try {
    // שלב 1: עדכון כל השדות למעט התמונה
    const updateResponse = await axios.put(
      `http://localhost:5000/api/userinfo/${userId}`,
      formFields
    );
    console.log("Update fields response:", updateResponse.data);

    // שלב 2: אם נבחרה תמונה – נעלה אותה
    if (selectedImageFile) {
      const formData = new FormData();
      formData.append("image", selectedImageFile);
      formData.append("userId", userId);

      const uploadResponse = await axios.post(
        "http://localhost:5000/api/upload-profile-picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      console.log("Upload image response:", uploadResponse.data);
      if (uploadResponse.data.success) {
        alert("Profile updated successfully!");
      } else {
        alert("Image upload failed");
      }
    } else {
      alert("Profile updated successfully!");
    }

    // שלב 3: שליפת הנתונים מחדש כדי לעדכן את התצוגה
    await fetchUserInfo();

  } catch (error) {
    console.error("Error saving profile:", error);
    alert("Failed to update profile");
  }
};



  return (
    <div>
      <HeaderBar profilePicture = {userInfo?.profilePicture}/>
      <ProfilePhotoField
        previewImage={previewImage || userInfo?.profilePicture}
        setPreviewImage={setPreviewImage}
        setSelectedImageFile={setSelectedImageFile}
        userInfo={userInfo}
      />
      <EditInfoSection onSave={handleSave} userInfo={userInfo} onCancel={fetchUserInfo}/>
    </div>
  );
}
