import React from "react";

const SearchBar = ({ search, onSearchChange }) => {
  return (
    <div className="relative flex-grow mr-4">
      <label htmlFor="search-quotes" className="sr-only">
        Search quotes
      </label>
      <input
        id="search-quotes"
        type="text"
        placeholder="Search quotes..."
        className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search quotes by text"
      />
    </div>
  );
};

export default SearchBar;
