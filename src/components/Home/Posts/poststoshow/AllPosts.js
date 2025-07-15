import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './AllPosts.css';
import ItemList from './ItemList';

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



export default function AllPosts({ groupId='none', refreshTrigger, filterBy = 'none',canViewPosts = true, isAdmin = false }) {
    const [allGroupPosts, setAllGroupPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const intervalRef = useRef();
    const userId = localStorage.getItem('userId');
    
    // Filter state
    const [filters, setFilters] = useState({
        byFirstName: false,
        byLastName: false,
        byContent: false,
        byEdited: false,
    });
    
    // Separate search queries for each filter
    const [searchQueries, setSearchQueries] = useState({
        byFirstName: '',
        byLastName: '',
        byContent: '',
    });

    const fetchPosts = async () => {
        // Only fetch posts if user has permission to view them
        if (!canViewPosts) {
            return;
        }

        try {
            setLoading(true); // Set loading true when fetching
            const res = await axios.get(`http://localhost:5000/api/posts/${groupId}/${userId}/${filterBy}`);
            // const res = await axios.get(`http://localhost:5000/api/groups/${groupId}/posts`);
            console.log('Fetched group posts:', res.data);
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
                if (!isEdited) {
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
        });
        setSearchQueries({
            byFirstName: '',
            byLastName: '',
            byContent: '',
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
        <div>
       
        <div className="group-all-posts">
            
            
            <PostFilter 
                filters={filters}
                onFilterChange={handleFilterChange}
                searchQueries={searchQueries}
                onSearchChange={handleSearchChange}
                isAdmin={isAdmin}
                onClearFilters={handleClearFilters}
                />
            
            <ItemList items={filteredPosts} refreshPosts={fetchPosts} admin={isAdmin} />
        </div>
        {loading&&
                <h2>loading posts...</h2>
        }
    </div>
    );
}