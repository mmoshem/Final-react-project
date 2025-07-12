// components/FilterDropdown.js
import React from 'react';
import './SearchBar.css';

const categories = {
  Location: ['Tel Aviv', 'Haifa', 'Jerusalem', 'Holon', 'Lod'],
  Industry: ['Tech', 'Finance', 'Education', 'Healthcare'],
  Company: ['Google', 'Meta', 'Amazon', 'Microsoft'],
  University: ['Technion', 'Braude', 'MIT', 'HIT'],
  Experience: ['Entry Level', 'Mid Level', 'Senior Level']
};

export default function FilterDropdown({ filters, setFilters }) {
  const handleChange = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: value
    }));
  };


  return (
    <div className="filter-dropdown-overlay">
      <div className="filter-dropdown-container">
        {Object.entries(categories).map(([category, options]) => (
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
    </div>
  );
}
