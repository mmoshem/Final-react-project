import React, { useEffect,useState } from 'react';
//import LogoutButton from './LogoutButton';
import HeaderBar from '../HeaderBar/HeaderBar';
import axios from 'axios';
import './Home.css';
import UserInfo from '../UserInfo';
import Post from './Posts/posting/Post';
import AllPosts from './Posts/AllPosts';
import PostDummy from './Posts/posting/PostDummy';
import Modal from './Posts/Modal';
import './Posts/Modal.css';
export default function Home() {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
 
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [PostDummyClicked, setPostDummyClicked] = useState(false);
    const handlePostSuccess = () => {
        setRefreshTrigger(prev => !prev);
    };
   useEffect(() => {
  const fetchUserInfo = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(`http://localhost:5000/api/userinfo/${userId}`);
      console.log("🔍 userInfo from server:", response.data); // ⬅️ תוסיפי שורה זו
      setUserInfo(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load user info:", err);
      setError(err);
      setLoading(false);
    }
  };

  fetchUserInfo();
}, []);

    
   
    return (
        <div>
            <header className="flex justify-between items-center mb-4">
                <HeaderBar 
                    profilePicture = {userInfo?.profilePicture}
                />

                {/*<h1 className="text-3xl font-bold">Home</h1>*/}
            </header>
            <div className='home-container'>
                <PostDummy setPostDummyClicked={setPostDummyClicked} profilePicture = {userInfo?.profilePicture}/>

                { PostDummyClicked &&(
                    <Modal onClose={()=> setPostDummyClicked(false) }>
                        <Post onPostSuccess={handlePostSuccess} setPostDummyClicked={setPostDummyClicked}  />
                    </Modal>
                )}
                <AllPosts refreshTrigger={refreshTrigger} />
            </div>
        </div>
    );
}
