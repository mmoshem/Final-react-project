import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ItemList from './ItemList';
import './AllPosts.css';

export default function AllPosts({ refreshTrigger, filterType = 'all', groupId = null }) {
    const [allusersPosts, setAllusersPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentFilter, setCurrentFilter] = useState(filterType);
    const intervalRef = useRef();
    const userId = localStorage.getItem('userId');

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                userId: userId,
                filterType: currentFilter
            });
            
            if (groupId) {
                params.append('groupId', groupId);
            }
            
            const res = await axios.get(`http://localhost:5000/api/posts?${params}`);
            console.log('Posts fetched:', res.data);
            if (res.data.length > 0) {
                console.log('First post structure:', res.data[0]);
            }
            setAllusersPosts(res.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilter) => {
        setCurrentFilter(newFilter);
    };

    const getFilterOptions = () => {
        if (groupId) {
            // Group page filters
            return [
                { value: 'group', label: 'All Posts in Group' },
                { value: 'my', label: 'My Posts in Group' }
            ];
        } else {
            // Home page filters
            return [
                { value: 'all', label: 'All Posts' },
                { value: 'my', label: 'My Posts' },
                { value: 'followed', label: 'Followed Users' },
                { value: 'groups', label: 'Group Posts' },
                { value: 'myInGroups', label: 'My Posts in Groups' },
                { value: 'followedInGroups', label: 'Followed Users in Groups' },
                { value: 'myGroupsPosts', label: 'Posts from My Groups' }
            ];
        }
    };

    const filterOptions = getFilterOptions();

    useEffect(() => {
        fetchPosts(); // Fetch on mount
        intervalRef.current = setInterval(fetchPosts, 60000); // Fetch every 1 min
        return () => clearInterval(intervalRef.current); // Cleanup on unmount
    }, [currentFilter, groupId]);

    useEffect(() => {
        if (refreshTrigger !== undefined) {
            fetchPosts();
        }
    }, [refreshTrigger]);

    return (
        <div className="all-posts">
            <div className="posts-header">
                <h2>{groupId ? 'Group Posts' : 'All Posts'}</h2>
                <div className="filter-dropdown">
                    <select 
                        value={currentFilter} 
                        onChange={(e) => handleFilterChange(e.target.value)}
                        className="filter-select"
                    >
                        {filterOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {loading ? (
                <div className="loading-posts">
                    <p>Loading posts...</p>
                </div>
            ) : (
                <ItemList 
                    items={allusersPosts} 
                    refreshPosts={fetchPosts} 
                    groupId={groupId}
                />
            )}
        </div>
    );
}