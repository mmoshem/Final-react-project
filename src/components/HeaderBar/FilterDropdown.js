// components/FilterDropdown.js
import React from 'react';
import filterOptions from '../../data/filterOptions.json';
import './SearchBar.css';

export default function FilterDropdown({ filters, setFilters }) {
  const handleChange = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: value
    }));
  };

  return (
    <div className="filter-dropdown-container">
      {Object.entries(filterOptions).map(([category, options]) => (
        <div key={category} className="filter-category">
          <label htmlFor={category}>{category}</label>
          <input
            list={`options-${category}`}
            id={category}
            value={filters[category] || ''}
            onChange={(e) => handleChange(category, e.target.value)}
            placeholder="All"
          />
          <datalist id={`options-${category}`}>
            {options.map(option => (
              <option key={option} value={option} />
            ))}
          </datalist>
        </div>
      ))}
    </div>
  );
}