import React from 'react';
import './SearchBar.css';

function SearchBar({ 
    searchQuery, 
    onSearchChange, 
    onSearch, 
    onKeyPress, 
    isSearching = false,
    placeholder = "Search for groups"
}) {
    return (
        <div className="search-input-container">
            <input
                type="text"
                className="group-search-input"
                placeholder={placeholder}
                value={searchQuery}
                onChange={onSearchChange}
                onKeyPress={onKeyPress}
            />
            <button 
                className="search-button"
                onClick={onSearch}
                disabled={isSearching}
            >
                {isSearching ? '🔄' : '🔍'}
            </button>
        </div>
    );
}

export default SearchBar;