import React, { useState } from 'react';
import './DiscoverGroupSearch.css';
import axios from 'axios';

function DiscoverGroupSearch() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        
        setIsSearching(true);
        setHasSearched(true);
        
        try {
            // Future: Replace with actual API call
            // const response = await axios.get(`/api/groups/search?q=${searchQuery}`);
            // setSearchResults(response.data);
            
try {
    const response = await axios.get(`http://localhost:5000/api/groups/search?q=${searchQuery}`);
    setSearchResults(response.data);
    setIsSearching(false);
} catch (error) {
    console.error('Search error:', error);
    setSearchResults([]);
    setIsSearching(false);
}
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
                        placeholder="Search for groups (e.g., 'react', 'javascript', 'design')"
                        value={searchQuery}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                    />
                    <button 
                        className="search-button"
                        onClick={handleSearch}
                        disabled={!searchQuery.trim() || isSearching}
                    >
                        {isSearching ? '🔄' : '🔍'}
                    </button>
                </div>
            </div>

            <div className="search-results">
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

                {searchResults.length > 0 && (
                    <div className="results-list">
                        {searchResults.map(group => (
                            <div key={group.id} className="group-result-card">
                                <div className="group-info">
                                    <h4>{group.name}</h4>
                                    <p>{group.description}</p>
                                    <span className="member-count">{group.memberCount} members</span>
                                </div>
                                <button className="join-group-btn">
                                    Join Group
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {!hasSearched && (
                    <div className="search-placeholder">
                        <p>🔍 Search for groups to discover communities that match your interests!</p>
                        <p>Try searching for topics like "react", "design", "startup", or "marketing"</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DiscoverGroupSearch;