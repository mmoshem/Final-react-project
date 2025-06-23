import React, { useEffect,useState } from 'react';
//import LogoutButton from './LogoutButton';
import HeaderBar from './HeaderBar/HeaderBar';
import axios from 'axios';
import './Home.css';
import UserInfo from './UserInfo';


export default function Home() {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchText, setSearchText] = useState('');
    
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
               <UserInfo userInfo={userInfo}/>
            )}
        </div>
    );
}
