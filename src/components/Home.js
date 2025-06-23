import React, { useEffect,useState } from 'react';
//import LogoutButton from './LogoutButton';
import HeaderBar from './HeaderBar/HeaderBar';
import axios from 'axios';
import './Home.css';

export default function Home() {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading , setSearchLoading] = useState(false);
    
    //getting user info from the backend
    useEffect(() => {
        
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setError('User ID not found in localStorage.');
            setLoading(false);
            return;
        }
        axios.get(`http://localhost:5000/api/userinfo/${userId}`)
            .then(res => {
                setUserInfo(res.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch user info.');
                setLoading(false);
            });
    }, []);


   

   
    return (
        <div>
            <header className="flex justify-between items-center mb-4">
                <HeaderBar 
                    searchText={searchText} 
                    profilePicture = {userInfo?.profilePicture}
                />

                {/*<h1 className="text-3xl font-bold">Home</h1>*/}
            </header>
           
            {loading && <p>Loading user info...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {userInfo && (
                <div className="user-info">
                    <p><strong>Birth Date:</strong> {userInfo.birthDate ? new Date(userInfo.birthDate).toLocaleDateString() : 'Not set'}</p>
                    <p><strong>Profile Picture:</strong> {userInfo.profilePicture ? <img src={userInfo.profilePicture} alt="Profile" style={{ width: 80, height: 80, borderRadius: '50%' }} /> : 'Not set'}</p>
                    <p><strong>Following Users:</strong> {userInfo.followingUsers.length}</p>
                    <p><strong>Following Pages:</strong> {userInfo.followingPages.length}</p>
                </div>
            )}
        </div>
    );
}
