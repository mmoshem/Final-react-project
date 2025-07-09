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
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [postDummyClicked, setPostDummyClicked] = useState(false);
    const [isLocked, setIsLocked] = useState(false);

   useEffect(() => {
    const fetchUserInfo = async () => {
    try 
    {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(`http://localhost:5000/api/userinfo/${userId}`);
      console.log("🔍 userInfo from server:", response.data); // ⬅️ תוסיפי שורה זו
      setUserInfo(response.data);
    } 
    catch (err) {
      console.error("Failed to load user info:", err);   
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
            <div className='home-main-layout'>
            <div className="sidebar">
                <h2>Friends</h2>
                <ul>
                <li>Friend 1</li>
                <li>Friend 2</li>
                {/* Add more friends here */}
                </ul>
            </div>
                <div className='main-content'>
                    <PostDummy setPostDummyClicked={setPostDummyClicked} profilePicture = {userInfo?.profilePicture}/>

                    { postDummyClicked &&(
                        <Modal onClose={()=> setPostDummyClicked(false)} isLocked={isLocked}>
                            <Post setIsLocked={setIsLocked} onPostSuccess={()=>setRefreshTrigger(prev => !prev)} onClose={()=> setPostDummyClicked(false)}  />
                        </Modal>
                    )}
                    <AllPosts refreshTrigger={refreshTrigger} />
                </div>
            </div>
        </div>
    );
}
