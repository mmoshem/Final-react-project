import React, { useEffect,useState } from 'react';
//import LogoutButton from './LogoutButton';
import HeaderBar from '../HeaderBar/HeaderBar';
import axios from 'axios';
import './Home.css';
import UserInfo from '../UserInfo';
import Post from './Posts/posting/Post';
import AllPosts from './Posts/poststoshow/AllPosts';
import PostDummy from './Posts/posting/PostDummy';
import Modal from './Posts/poststoshow/Modal';
import './Posts/poststoshow/Modal.css';
import FriendsListing from './FriendsListing';
import SelectFeedButtons from './SelectFeedButtons';
import DailyQuestion from './DailyQuestion';

export default function Home() {
    const [userInfo, setUserInfo] = useState(null);
    const [following,setFollowing] = useState([]);
    const [followers,setFollowers] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [postDummyClicked, setPostDummyClicked] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [filterBy,setFilterBy] = useState('none');
    const [questionModalOpen, setQuestionModalOpen] = useState(false);

   useEffect(() => {
    const fetchUserInfo = async () => {
    try 
    {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(`http://localhost:5000/api/userinfo/${userId}`);
      console.log("🔍 userInfo from server:", response.data); 
      setUserInfo(response.data);
       setFollowing(response.data.followingUsers);
    setFollowers(response.data.followers);

    } 
    catch (err) {
      console.error("Failed to load user info:", err);   
    }
    };

  fetchUserInfo();
}, []);
   

let friends = following.filter(user =>
    followers.map(f => f.toString()).includes(user.toString())
  );
    return (
        <div>
            <header className="header-bar-fixed flex justify-between items-center mb-4">
                <HeaderBar 
                    profilePicture = {userInfo?.profilePicture}
                    />

                {/*<h1 className="text-3xl font-bold">Home</h1>*/}
            </header>
            
            <div className='home-main-layout'>
                <div className="sidebar">
                    <SelectFeedButtons setFilterBy = {setFilterBy} onSelect ={()=>setRefreshTrigger(prev => !prev)} />
                    <FriendsListing userFriends={ friends } />                
                </div>
                
                <div className='main-content'>
                    <button 
                        className="daily-question-button"
                        onClick={() => setQuestionModalOpen(true)}
                        >
                        📚 Daily Question
                    </button>  
                    <PostDummy setPostDummyClicked={setPostDummyClicked} profilePicture = {userInfo?.profilePicture}/>
                    { postDummyClicked &&(
                        <Modal onClose={()=> setPostDummyClicked(false)} isLocked={isLocked}>
                            <Post setIsLocked={setIsLocked} onPostSuccess={()=>setRefreshTrigger(prev => !prev)} onClose={()=> setPostDummyClicked(false)}  />
                        </Modal>
                    )}
                    <AllPosts refreshTrigger={refreshTrigger} filterBy={filterBy} />
                    {questionModalOpen && (
                        <Modal onClose={() => setQuestionModalOpen(false)} isLocked={false}>
                            <DailyQuestion userInfo={userInfo} />
                        </Modal>
                    )}
                    <AllPosts refreshTrigger={refreshTrigger} />
                </div>

            </div>
        </div>
    );
}
