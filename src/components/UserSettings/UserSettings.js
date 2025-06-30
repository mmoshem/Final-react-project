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
  const handleSave = async () => {
    if (!selectedImageFile) {
      alert("No image selected");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImageFile);
    formData.append("userId", userId);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/upload-profile-picture", 
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        alert("Profile photo uploaded successfully!");
        console.log("Image URL:", response.data.url);
        await fetchUserInfo();
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading image");
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
      <EditInfoSection onSave={handleSave} userInfo={userInfo}/>
    </div>
  );
}
