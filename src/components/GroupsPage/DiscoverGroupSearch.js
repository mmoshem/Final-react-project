import React, { useState, useEffect } from 'react';
import './DiscoverGroupSearch.css';
import axios from 'axios';

function DiscoverGroupSearch() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [allGroups, setAllGroups] = useState([]);
    const [displayedGroups, setDisplayedGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAllGroups();
    }, []);

    const fetchAllGroups = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('http://localhost:5000/api/groups');
            setAllGroups(response.data);
            setDisplayedGroups(response.data);
        } catch (error) {
            console.error('Error fetching groups:', error);
            setAllGroups([]);
            setDisplayedGroups([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setHasSearched(false);
            setDisplayedGroups(allGroups);
            return;
        }
        
        setIsSearching(true);
        setHasSearched(true);
        
        try {
            const response = await axios.get(`http://localhost:5000/api/groups/search?q=${searchQuery}`);
            setSearchResults(response.data);
            setIsSearching(false);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
            setIsSearching(false);
        }
    };

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
        if (e.target.value === '') {
            setHasSearched(false);
            setSearchResults([]);
            setDisplayedGroups(allGroups);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="group-discover-search">
            <h2>Discover Groups</h2>
            
            <div className="search-section">
                <div className="search-input-container">
                    <input
                        type="text"
                        className="group-search-input"
                        placeholder="Search for groups"
                        value={searchQuery}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                    />
                    <button 
                        className="search-button"
                        onClick={handleSearch}
                        disabled={isSearching}
                    >
                        {isSearching ? '🔄' : '🔍'}
                    </button>
                </div>
            </div>

            <div className="search-results">
                {isLoading && (
                    <div className="loading-state">
                        <p>Loading groups...</p>
                    </div>
                )}

                {isSearching && (
                    <div className="loading-state">
                        <p>Searching for groups...</p>
                    </div>
                )}

                {hasSearched && !isSearching && searchResults.length === 0 && (
                    <div className="no-results">
                        <p>No groups found for "{searchQuery}"</p>
                        <p>Try different keywords or create a new group!</p>
                    </div>
                )}

                {hasSearched && searchResults.length > 0 && (
                    <div className="results-list">
                        {searchResults.map(group => (
                            <div key={group._id} className="group-result-card">
                                <div className="group-info">
                                    <h4>{group.name}</h4>
                                    <p>{group.description}</p>
                                    <span className="member-count">{group.memberCount || 0} members</span>
                                </div>
                                <button className="join-group-btn">
                                    Join Group
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && !hasSearched && displayedGroups.length > 0 && (
                    <div className="groups-grid">
                        {displayedGroups.map(group => (
                            <div key={group._id} className="group-card">
                                <h4>{group.name}</h4>
                                <p>{group.description}</p>
                                <span>{group.memberCount || 0} members</span>
                                <button className="join-group-btn">
                                    Join Group
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && !hasSearched && displayedGroups.length === 0 && (
                    <div className="no-results">
                        <p>No groups available yet</p>
                        <p>Be the first to create a group!</p>
                    </div>
                )}

                
            </div>
        </div>
    );
}

export default DiscoverGroupSearch;