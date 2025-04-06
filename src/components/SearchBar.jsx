// src/components/SearchBar.jsx
import React from "react";

const SearchBar = ({ search, onSearchChange }) => {
  return (
    <input
      type="text"
      placeholder="Search quotes..."
      className="flex-grow p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  );
};

export default SearchBar;
