import React from "react";



function SearchBar({value, onSearchChange}) {
  return (
    <div className="search-bar">
      <input 
        type="text"
        value={value}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search here :)" />
    </div>
  );
}

export default SearchBar;
