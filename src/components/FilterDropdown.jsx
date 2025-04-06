// src/components/FilterDropdown.jsx
import React from "react";

const FilterDropdown = ({ authors, selectedAuthor, onFilterChange }) => {
  return (
    <select
      className="ml-4 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
      value={selectedAuthor}
      onChange={(e) => onFilterChange(e.target.value)}
    >
      <option value="">All Authors</option>
      {authors.map((author, index) => (
        <option key={index} value={author}>
          {author}
        </option>
      ))}
    </select>
  );
};

export default FilterDropdown;
