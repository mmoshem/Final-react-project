import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar/SearchBar';
import { useNavigate } from 'react-router-dom'; 
import GroupCard from './GroupCard/GroupCard';
import './DiscoverGroupSearch.css';
import axios from 'axios';

function DiscoverGroupSearch() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [allGroups, setAllGroups] = useState([]);
    const [displayedGroups, setDisplayedGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [joiningGroups, setJoiningGroups] = useState(new Set());

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
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
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

    const handleJoinGroup = async (groupId) => {
        try {
            setJoiningGroups(prev => new Set([...prev, groupId]));
            
            // Add your join group API call here
            // const response = await axios.post(`http://localhost:5000/api/groups/${groupId}/join`);
            
            console.log('Joining group:', groupId);
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
        } catch (error) {
            console.error('Error joining group:', error);
        } finally {
            setJoiningGroups(prev => {
                const newSet = new Set(prev);
                newSet.delete(groupId);
                return newSet;
            });
        }
    };

    const handleGroupClick = (groupId) => {
        console.log('Navigating to group:', groupId);
                navigate(`/groups/${groupId}`);

        // Add navigation logic here
    };

    return (
        <div className="group-discover-search">
            <h2>Discover Groups</h2>
            
            <div className="search-section">
                <SearchBar
                    searchQuery={searchQuery}
                    onSearchChange={handleInputChange}
                    onSearch={handleSearch}
                    onKeyPress={handleKeyPress}
                    isSearching={isSearching}
                    placeholder="Search for groups"
                />
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
                            <GroupCard
                                key={group._id}
                                group={group}
                                variant="list"
                                onJoinClick={handleJoinGroup}
                                onCardClick={handleGroupClick}
                                isJoining={joiningGroups.has(group._id)}
                            />
                        ))}
                    </div>
                )}

                {!isLoading && !hasSearched && displayedGroups.length > 0 && (
                    <div className="groups-grid">
                        {displayedGroups.map(group => (
                            <GroupCard
                                key={group._id}
                                group={group}
                                variant="grid"
                                onJoinClick={handleJoinGroup}
                                onCardClick={handleGroupClick}
                                isJoining={joiningGroups.has(group._id)}
                            />
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