import React from "react";

const FilterDropdown = ({ authors, selectedAuthor, onFilterChange }) => {
  return (
    <div>
      <label htmlFor="author-filter" className="sr-only">
        Filter by author
      </label>
      <select
        id="author-filter"
        className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        value={selectedAuthor}
        onChange={(e) => onFilterChange(e.target.value)}
        aria-label="Filter quotes by author"
      >
        <option value="">All Authors</option>
        {authors.map((author, index) => (
          <option key={index} value={author}>
            {author}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterDropdown;
