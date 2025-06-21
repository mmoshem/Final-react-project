import React from "react";



function SearchBar({onSearchChange}) {
  return (
    <div className="search-bar">
      <input type="text"
       onChange={(e) => onSearchChange(e.target.value)}
       placeholder="Search here :)" />
    </div>
  );
}

export default SearchBar;
