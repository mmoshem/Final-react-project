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
import FriendsListing from './FriendsListing';
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
    let users=["6864345ab4bccb8cd1354cd7","686eb955e12152a8caa97d10"]
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
                <FriendsListing userFriends={users} />                

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
