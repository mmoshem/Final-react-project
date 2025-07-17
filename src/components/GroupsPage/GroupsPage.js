import React, { useState, useEffect } from 'react';
import './GroupsPage.css';
import HeaderBar from '../HeaderBar/HeaderBar';
import CreateGroupButton from './CreateGroupButton'; 
import AllGroupsButton from './AllGroupsButton';
import CreatedGroupsButton from './CreatedGroupsButton';
import JoinedGroupsButton from './JoinedGroupsButton';
import DiscoverGroupSearch from './DiscoverGroupSearch';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function GroupsPage() {
    const [selectedFilter, setSelectedFilter] = useState('all'); // הפילטרים לקבוצות שניישם כברירת מחדל מציג את כולם 
    const [userGroups, setUserGroups] = useState({ //נאתחל את כל סוגי הקבוצות כקבוצה ריקה לכל אחד 
        all: [], 
        created: [],
        joined: []
    });    
const [isLoading, setIsLoading] = useState(true); // האם טוען קבוצות או משהו כשפתחנו דף הקבוצות 
    const navigate = useNavigate();
    const location = useLocation();// נותן מידע על הURL הנוכחי לדעת האם לרפרש לדוג וכו
    const userId = localStorage.getItem('userId'); // לא סטייט רגיל אלא משתמש שנשמר בדפדפן כשעשה לוג אין שנדע לאיזה משתמש לשייך את הקבוצות 

    useEffect(() => {
        fetchUserGroups(); // רצה  בהתחלה כשהקומפוננטה נטענת להביא את הקבוצות של המשתמש 
    }, []);

    // Check if we need to refresh after group creation
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search); // מזהה אם יש יו אר אל - שאומר שצריך לרפרש חדשים משמע נוצרה קבוצה חדשה
        if (searchParams.get('refresh') === 'true') {
            // Remove the refresh parameter from URL
            navigate('/GroupsPage', { replace: true }); // כדי לא לרפרש שוב ושוב  מעיף את הסיומת של ריפרש שווה טרו
            // Refresh the groups list
            fetchUserGroups(); // תטען את הקומפוננטה ותביא את הקבוצות שוב 
        }
    }, [location.search, navigate]);

    const fetchUserGroups = async () => { // קריאה לשרת להביא את הקבוצות של המשתמש
        try {
            setIsLoading(true);
            // Fetch all groups and filter on frontend for now
            // In a real app, you'd have specific endpoints like:
            // - /api/users/{userId}/groups/created
            // - /api/users/{userId}/groups/joined
            const response = await axios.get('http://localhost:5000/api/groups'); // מביאים כרגע מהשרת את כל הקבוצות ומפלטרים בצד הלקוח
            const allGroups = response.data; // התגובה של השרת-הקבוצות
            
            console.log('All groups:', allGroups);
            console.log('Current user ID:', userId);
            
            // Filter groups based on user's relationship
            const userCreatedGroups = allGroups.filter(group => { // רשימה של כל הקבוצות שהמשתמש יצר
                const creatorId = group.creator?._id || group.creator; // בודקים את האיידי של היוצר לפעמים זה אובייקט ולפעמים זה סטרינג
                const isCreator = creatorId === userId; // האם המשתמש המחובר הוא יוצר הקבוצה
                console.log(`Group "${group.name}": creator=${creatorId}, userId=${userId}, isCreator=${isCreator}`);
                return isCreator;// אם המשתמש הוא אכן יוצר הקבוצה נחזיר טרו שהקבוצה בסינון 
            });
            
            const userJoinedGroups = allGroups.filter(group => { // הקבוצות שאליהן הצטרף-רשימה
                const creatorId = group.creator?._id || group.creator; // האם הוא האדמין 
                const isCreator = creatorId === userId;
                const isMember = group.members && group.members.some(member => { // האם מתוך מערך החברים לפחות אחד- בדיוק אחד זה היוזר שלנו 
                    const memberId = member._id || member;
                    return memberId === userId;
                });
                return isMember && !isCreator; // אם הוא חבר אך לא האדמין 
            });
            const userGroups = allGroups.filter(group => { // מערך של כל הקבוצות של היוזר 
                const creatorId = group.creator?._id || group.creator; // האם הוא היוצר 
                const isCreator = creatorId === userId;
                const isMember = group.members && group.members.some(member => {// האם יש מערך חברים והאם היוזר חלק מהם 
                    const memberId = member._id || member;
                    return memberId === userId;
                });
                return isMember || isCreator; // אם יצר או הצטרף לקבוצה תחזיר אמת 
            });

            console.log('User created groups:', userCreatedGroups);
            console.log('User joined groups:', userJoinedGroups);

            setUserGroups({ //שומרים את כל הקבוצות בסטייט משתנה
                all: userGroups,
                created: userCreatedGroups,
                joined: userJoinedGroups
            });
        } catch (error) {// אם הייתה בעיה בשליפה נאפס את הקבוצות שלא יציג מידע שגוי
            console.error('Error fetching user groups:', error);
            setUserGroups({ all: [], created: [], joined: [] });
        } finally {
            setIsLoading(false); // אם הצלחנו או לא תסיים טעינה
        }
    };

    const handleFilterChange = (filter) => { //פונקציה שמחליפה בין הפילטרים
        setSelectedFilter(filter);
        console.log(`Filter changed to: ${filter}`);
    };

    const handleGroupClick = (groupId) => { // לפי מזהה הקבוצה נווט את המשתמש לקבוצה הנדרשת 
        navigate(`/groups/${groupId}`);
    };

    const getFilteredGroups = () => { // כל הקבוצות המפולטרות 
        return userGroups[selectedFilter] || []; // כגיבוי יחזיר מערך ריק 
    };

    const renderGroupItem = (group) => ( //האות הראשונה מוצגת כאווטאר ואם לא נמצאה ישים G 
        <div 
            key={group._id} 
            className="group-item"
            onClick={() => handleGroupClick(group._id)}
        >
            <div className="group-avatar">
                {group.name ? group.name.charAt(0).toUpperCase() : 'G'}
            </div>
            <div className="group-name">
                {group.name}
            </div>
        </div>
    );

    return (
        <div>
          {/*ההדר בראש העמוד */}
            <HeaderBar   profilePicture ={localStorage.getItem('userProfileImage')}/>
            <div className="groups-page-container">
                {/* Left Sidebar */}
                <div className="groups-sidebar">
                    <CreateGroupButton />
                    
                    <div className="user-groups-section">
                        <h3>Your Groups</h3>

                        <div className="filter-buttons"> 
                            <AllGroupsButton 
                                isActive={selectedFilter === 'all'}
                                onClick={() => handleFilterChange('all')}
                            />
                            <CreatedGroupsButton 
                                isActive={selectedFilter === 'created'}
                                onClick={() => handleFilterChange('created')}
                            />
                            <JoinedGroupsButton 
                                isActive={selectedFilter === 'joined'}
                                onClick={() => handleFilterChange('joined')}
                            />
                        </div>
                        
                        <div className="groups-list">
                            {isLoading ? (
                                <div className="loading-state">
                                    <p>Loading your groups...</p>
                                </div>
                            ) : getFilteredGroups().length > 0 ? (
                                getFilteredGroups().map(renderGroupItem)
                            ) : (
                                <div className="no-groups-message">
                                    <p>
                                        {selectedFilter === 'all' && 'No groups available'}
                                        {selectedFilter === 'created' && 'You haven\'t created any groups yet'}
                                        {selectedFilter === 'joined' && 'You haven\'t joined any groups yet'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="groups-search-area">
                    <DiscoverGroupSearch />
                </div>
            </div>
        </div>
    );
}

export default GroupsPage;