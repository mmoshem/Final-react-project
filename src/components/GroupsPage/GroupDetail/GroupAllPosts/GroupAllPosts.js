import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './GroupAllPosts.css';
import ItemList from '../../../Home/Posts/poststoshow/ItemList';

// Filter component (inline)
function PostFilter({ filters, onFilterChange, searchQueries, onSearchChange, isAdmin, onClearFilters }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const activeFiltersCount = Object.values(filters).filter(Boolean).length;
    const hasActiveSearches = Object.values(searchQueries).some(query => query.trim());

    return (
        <div className="post-filter-container">
            <div className="filter-header">
                <h3>Filter Posts</h3>
                <div className="filter-controls">
                    {(activeFiltersCount > 0 || hasActiveSearches) && (
                        <button 
                            onClick={onClearFilters}
                            className="clear-filters-btn"
                        >
                            Clear All
                        </button>
                    )}
                    <div className="filter-dropdown" ref={dropdownRef}>
                        <button 
                            className={`filter-toggle-btn ${isDropdownOpen ? 'active' : ''}`}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <span>Filters</span>
                            {activeFiltersCount > 0 && (
                                <span className="filter-badge">{activeFiltersCount}</span>
                            )}
                            <span className="dropdown-arrow">▼</span>
                        </button>
                        
                        {isDropdownOpen && (
                            <div className="filter-dropdown-content">
                                <div className="filter-section">
                                    <h4>User Information</h4>
                                    <div className="filter-options">
                                        <label className="filter-option">
                                            <input
                                                type="checkbox"
                                                checked={filters.byFirstName}
                                                onChange={(e) => onFilterChange('byFirstName', e.target.checked)}
                                            />
                                            <span>First Name</span>
                                        </label>
                                        
                                        <label className="filter-option">
                                            <input
                                                type="checkbox"
                                                checked={filters.byLastName}
                                                onChange={(e) => onFilterChange('byLastName', e.target.checked)}
                                            />
                                            <span>Last Name</span>
                                        </label>
                                        
                                        <label className="filter-option">
                                            <input
                                                type="checkbox"
                                                checked={filters.byContent}
                                                onChange={(e) => onFilterChange('byContent', e.target.checked)}
                                            />
                                            <span>Post Content</span>
                                        </label>
                                    </div>
                                </div>
                                
                                {isAdmin && (
                                    <div className="filter-section">
                                        <h4>Admin Filters</h4>
                                        <div className="filter-options">
                                            <label className="filter-option">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.byEdited}
                                                    onChange={(e) => onFilterChange('byEdited', e.target.checked)}
                                                />
                                                <span>Edited Posts Only</span>
                                            </label>
                                            
                                            <label className="filter-option">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.byEmail}
                                                    onChange={(e) => onFilterChange('byEmail', e.target.checked)}
                                                />
                                                <span>User Email</span>
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Search inputs for active filters */}
            {activeFiltersCount > 0 && (
                <div className="search-inputs">
                    {filters.byFirstName && (
                        <div className="search-input-group">
                            <label>First Name:</label>
                            <input
                                type="text"
                                placeholder="Enter first name..."
                                value={searchQueries.byFirstName}
                                onChange={(e) => onSearchChange('byFirstName', e.target.value)}
                                className="filter-search-input"
                            />
                        </div>
                    )}
                    
                    {filters.byLastName && (
                        <div className="search-input-group">
                            <label>Last Name:</label>
                            <input
                                type="text"
                                placeholder="Enter last name..."
                                value={searchQueries.byLastName}
                                onChange={(e) => onSearchChange('byLastName', e.target.value)}
                                className="filter-search-input"
                            />
                        </div>
                    )}
                    
                    {filters.byContent && (
                        <div className="search-input-group">
                            <label>Post Content:</label>
                            <input
                                type="text"
                                placeholder="Enter content to search..."
                                value={searchQueries.byContent}
                                onChange={(e) => onSearchChange('byContent', e.target.value)}
                                className="filter-search-input"
                            />
                        </div>
                    )}
                    
                    {filters.byEmail && isAdmin && (
                        <div className="search-input-group">
                            <label>User Email:</label>
                            <input
                                type="text"
                                placeholder="Enter email address..."
                                value={searchQueries.byEmail}
                                onChange={(e) => onSearchChange('byEmail', e.target.value)}
                                className="filter-search-input"
                            />
                        </div>
                    )}
                    
                    {filters.byEdited && isAdmin && (
                        <div className="search-input-group">
                            <div className="filter-info">
                                <span>📝 Showing only edited posts</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ItemList component (inline)
// function ItemList({ items, loading }) {
//     if (loading) {
//         return (
//             <div className="loading-posts">
//                 <p>Loading posts...</p>
//             </div>
//         );
//     }
    
//     if (!items || items.length === 0) {
//         return (
//             <div className="no-posts">
//                 <p>No posts found matching your filters.</p>
//             </div>
//         );
//     }

//     return (
//         <div className="posts-list">
//             {items.map((post) => (
//                 <div key={post._id} className="post-item">
//                     <div className="post-header">
//                         <div className="post-author-info">
//                             <img 
//                                 src={post.userId?.profilePicture?.trim() ? post.userId.profilePicture : '/default-avatar.png'} 
//                                 alt={post.userId?.first_name && post.userId?.last_name 
//                                     ? `${post.userId.first_name} ${post.userId.last_name}`
//                                     : post.userId?.name || 'User'}
//                                 className="post-author-pic"
//                                 style={{ 
//                                     width: '40px', 
//                                     height: '40px', 
//                                     borderRadius: '50%',
//                                     marginRight: '10px'
//                                 }}
//                             />
//                             <div>
//                                 <span className="post-author" style={{ textTransform: 'capitalize', fontWeight: 600 }}>
//                                     {post.userId?.first_name && post.userId?.last_name 
//                                         ? `${post.userId.first_name} ${post.userId.last_name}`
//                                         : post.userId?.name?.trim() || 'Unknown User'}
//                                 </span>
//                                 <span className="post-time" style={{ display: 'block', color: '#888', fontSize: '12px' }}>
//                                     {new Date(post.createdAt).toLocaleString()}
//                                     {post.updatedAt && post.updatedAt !== post.createdAt && (
//                                         <span style={{ color: '#ff6b35', marginLeft: '8px' }}>
//                                             (edited)
//                                         </span>
//                                     )}
//                                 </span>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="post-content">
//                         {post.content}
//                     </div>
//                     {post.imageUrl && (
//                         <div className="post-image">
//                             <img 
//                                 src={post.imageUrl} 
//                                 alt="Post" 
//                                 style={{ maxWidth: '100%', borderRadius: '8px' }}
//                             />
//                         </div>
//                     )}
//                 </div>
//             ))}
//         </div>
//     );
// }

export default function GroupAllPosts({ groupId, refreshTrigger, canViewPosts = true, isAdmin = false }) {
    const [allGroupPosts, setAllGroupPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const intervalRef = useRef();
    
    // Filter state
    const [filters, setFilters] = useState({
        byFirstName: false,
        byLastName: false,
        byContent: false,
        byEdited: false,
        byEmail: false
    });
    
    // Separate search queries for each filter
    const [searchQueries, setSearchQueries] = useState({
        byFirstName: '',
        byLastName: '',
        byContent: '',
        byEmail: ''
    });

    const fetchPosts = async () => {
        // Only fetch posts if user has permission to view them
        if (!canViewPosts) {
            return;
        }

        try {
            setLoading(true); // Set loading true when fetching
          
            const res = await axios.get(`http://localhost:5000/api/groups/${groupId}/posts`);
            console.log('Fetched group posts:', res.data);
            if (res.data.length > 0) {
                console.log('First post user data:', res.data[0].userId);
            }
            setAllGroupPosts(res.data);
        } catch (error) {
            console.error('Error fetching group posts:', error);
        } finally {
            setLoading(false); // Set loading false when done
        }
    };

    // Filter posts based on selected filters and search queries
    const applyFilters = () => {
        // If no filters are active, show all posts
        if (!Object.values(filters).some(filter => filter)) {
            setFilteredPosts(allGroupPosts);
            return;
        }

        const filtered = allGroupPosts.filter(post => {
            const user = post.userId;
            const content = post.content || '';
            
            // Handle different user data structures
            let firstName = '';
            let lastName = '';
            let fullName = '';
            
            if (user) {
                // Check if user has first_name and last_name fields
                if (user.first_name && user.last_name) {
                    firstName = user.first_name;
                    lastName = user.last_name;
                    fullName = `${firstName} ${lastName}`;
                } else if (user.name) {
                    // Fallback to splitting the name field
                    const nameParts = user.name.split(' ');
                    firstName = nameParts[0] || '';
                    lastName = nameParts.slice(1).join(' ') || '';
                    fullName = user.name;
                }
            }
            
            const userEmail = user?.email || '';
            
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
                if (!content.toLowerCase().includes(query)) {
                    passesAllFilters = false;
                }
            }
            
            // Edited posts filter
            if (filters.byEdited && isAdmin) {
                if (!isEdited) {
                    passesAllFilters = false;
                }
            }
            
            // Email filter
            if (filters.byEmail && searchQueries.byEmail.trim()) {
                const query = searchQueries.byEmail.toLowerCase().trim();
                if (!userEmail.toLowerCase().includes(query)) {
                    passesAllFilters = false;
                }
            }
            
            return passesAllFilters;
        });

        setFilteredPosts(filtered);
    };

    // Apply filters when filters or search queries change
    useEffect(() => {
        applyFilters();
    }, [filters, searchQueries, allGroupPosts]);

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
            byEmail: false
        });
        setSearchQueries({
            byFirstName: '',
            byLastName: '',
            byContent: '',
            byEmail: ''
        });
    };

    useEffect(() => {
        if (canViewPosts) {
            fetchPosts(); // Fetch on mount only if user has permission
            intervalRef.current = setInterval(fetchPosts, 60000); // Fetch every 1 min
        }
        return () => clearInterval(intervalRef.current); // Cleanup on unmount
    }, [groupId, canViewPosts]);

    useEffect(() => {
        if (refreshTrigger !== undefined && canViewPosts) {
            fetchPosts();
        }
    }, [refreshTrigger, canViewPosts]);

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
        <div className="group-all-posts">
            <h2>Group Posts</h2>
            
            <PostFilter 
                filters={filters}
                onFilterChange={handleFilterChange}
                searchQueries={searchQueries}
                onSearchChange={handleSearchChange}
                isAdmin={isAdmin}
                onClearFilters={handleClearFilters}
            />
            
            <ItemList items={filteredPosts}  />
        </div>
    );
}