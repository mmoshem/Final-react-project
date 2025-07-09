import axios from "axios"
import { useEffect, useState } from "react";

export default function FriendsListing({ userFriends }) {
    const [friendsInfo, setFriendsInfo] = useState([]);

    useEffect(() => {
        const fetchFriendsList = async () => {
            try {
                // POST request with IDs in the body
                const res = await axios.post('http://localhost:5000/api/getFriendsInfo', {
                    allFriendsId: userFriends
                });
                setFriendsInfo(res.data);
            } catch (err) {
                console.error("Failed to fetch friends info", err);
            }
        };

        if (userFriends && userFriends.length > 0) {
            fetchFriendsList();
        }
    }, [userFriends]); //[]

    return (
        <div>
            {friendsInfo.map(friend => (
                <div key={friend.userId}>
                    <img src={friend.profilePicture} alt="Profile" width={50} />
                    <span>{friend.firstName} {friend.lastName}</span>
                </div>
            ))}
        </div>
    );
}