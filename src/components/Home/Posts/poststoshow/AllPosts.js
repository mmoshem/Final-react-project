import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './AllPosts.css';
import ItemList from './ItemList';
import styles from './PostItem.module.css';
import PostFilter from './PostFilter';



export default function AllPosts({ groupId='none', refreshTrigger, filterBy = 'none',canViewPosts = true, isAdmin = false ,ingroup = false, context = 'home'}) {
    const [allPosts, setAllPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const intervalRef = useRef();
    const userId = localStorage.getItem('userId');
    
    
    const [filters, setFilters] = useState({
        byFirstName: false,
        byLastName: false,
        byContent: false,
        byEdited: false,
        byDate: false,
    });
    
    
    const [searchQueries, setSearchQueries] = useState({
        byFirstName: '',
        byLastName: '',
        byContent: '',
        byDate: '', 
    });

    const fetchPosts = async (groupIdParam, userIdParam, filterByParam) => {
        if (!canViewPosts) {
            return;
        }
        try {
            setLoading(true); 
            const res = await axios.get(`http://localhost:5000/api/posts/${groupIdParam}/${userIdParam}/${filterByParam}`);
           
            console.log('Fetched group posts:', res.data);
            setAllPosts(res.data);
        } catch (error) {
            console.error('Error fetching group posts:', error);
        } finally {
            setLoading(false); 
        }
    };

    
    const applyFilters = useCallback(() => {
        if (!Object.values(filters).some(filter => filter)) {
            setFilteredPosts(allPosts);
            return;
        }

        const filtered = allPosts.filter(post => {

            
            
            // Handle different user data structures
            let firstName = '';
            let lastName = '';
            
            
            if (post) {
                // Check if user has first_name and last_name fields
                if (post.first_name && post.last_name) {
                    firstName = post.first_name;
                    lastName = post.last_name;
                   
                }
            }
            
            
            
            // Check if post was edited (has updatedAt different from createdAt)
            const isEdited = post.updatedAt && post.updatedAt !== post.createdAt;

            // Apply filters - all conditions must be met if multiple filters are active
            let passesAllFilters = true;

            // First Name filter
            if (filters.byFirstName && searchQueries.byFirstName.trim()) {
                const query = searchQueries.byFirstName.toLowerCase().trim();
                if (!firstName.toLowerCase().includes(query)) {
                    passesAllFilters = false;
                }
            }
            
            // Last Name filter
            if (filters.byLastName && searchQueries.byLastName.trim()) {
                const query = searchQueries.byLastName.toLowerCase().trim();
                if (!lastName.toLowerCase().includes(query)) {
                    passesAllFilters = false;
                }
            }
            
            // Content filter
            if (filters.byContent && searchQueries.byContent.trim()) {
                const query = searchQueries.byContent.toLowerCase().trim();
                if (!post.content.toLowerCase().includes(query)) {
                    passesAllFilters = false;
                }
            }
            
            // Edited posts filter
            if (filters.byEdited && isAdmin) {
                if (post.editedAt===null) {
                    passesAllFilters = false;
                }
            }
            
            // Date filter (admin only)
            if (filters.byDate && isAdmin && searchQueries.byDate) {
                // Convert UTC to local date string (YYYY-MM-DD)
                const localDate = new Date(post.createdAt);
                const pad = n => n.toString().padStart(2, '0');
                const localDateYMD = `${localDate.getFullYear()}-${pad(localDate.getMonth() + 1)}-${pad(localDate.getDate())}`;
                if (localDateYMD !== searchQueries.byDate) {
                    passesAllFilters = false;
                }
            }
            
           
            
            return passesAllFilters;
        });

        setFilteredPosts(filtered);
    },[isAdmin,filters, searchQueries, allPosts]);

    // Apply filters when filters or search queries change
    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
        
        // Clear the corresponding search query when filter is disabled
        if (!value) {
            setSearchQueries(prev => ({
                ...prev,
                [filterType]: ''
            }));
        }
    };

    const handleSearchChange = (filterType, value) => {
        setSearchQueries(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const handleClearFilters = () => {
        setFilters({
            byFirstName: false,
            byLastName: false,
            byContent: false,
            byEdited: false,
            byDate: false, // NEW
        });
        setSearchQueries({
            byFirstName: '',
            byLastName: '',
            byContent: '',
            byDate: '', // NEW
        });
    };

    useEffect(() => {
        if (canViewPosts) {
            fetchPosts(groupId, userId, filterBy); 
            intervalRef.current = setInterval(() => fetchPosts(groupId, userId, filterBy), 60000); 
        }
        return () => clearInterval(intervalRef.current); // Cleanup on unmount
    }, [groupId, canViewPosts, filterBy, userId]);

    useEffect(() => {
        if (refreshTrigger !== undefined && canViewPosts) {
            fetchPosts(groupId, userId, filterBy);
        }
    }, [refreshTrigger, canViewPosts, groupId, userId, filterBy]);

    // Add a wrapper to always use the latest params
    const fetchPostsWithCurrentParams = useCallback(() => {
        fetchPosts(groupId, userId, filterBy);
    }, [groupId, userId, filterBy]);

    // Determine the correct class for post items
    let postItemClass = '';
    if (context === 'home') postItemClass = styles.homePostItem;
    else if (context === 'group') postItemClass = styles.groupPostItem;
    else if (context === 'profile') postItemClass = styles.profilePostItem;


    // If user doesn't have permission to view posts, show a message
    if (!canViewPosts) {
        return (
            <div className="group-all-posts">
                <h2>Group Posts</h2>
                <div className="no-access-message">
                    <p>Join this group to view posts and participate in discussions!</p>
                </div>
            </div>
        );
    }

    return (
        <div>
       
        <div className="group-all-posts">
            
            
           {allPosts.length>0 &&(<PostFilter 
                filters={filters}
                onFilterChange={handleFilterChange}
                searchQueries={searchQueries}
                onSearchChange={handleSearchChange}
                isAdmin={isAdmin}
                onClearFilters={handleClearFilters}
                />)}
            
            <ItemList items={filteredPosts} refreshPosts={fetchPostsWithCurrentParams} admin={isAdmin} ingroup={ingroup} postItemClass={postItemClass} />
        </div>
        {loading&&
                <h2>loading posts...</h2>
        }
    </div>
    );
}