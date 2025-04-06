import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import FilterDropdown from "./FilterDropdown";
import { useBookmarks } from "../context/BookmarkContext";

const QuoteList = () => {
  const [quotes, setQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use the bookmark context instead of local state
  const { bookmarkedQuotes, toggleBookmark } = useBookmarks();

  useEffect(() => {
    setIsLoading(true);
    fetch("https://dummyjson.com/quotes")
      .then((response) => response.json())
      .then((data) => {
        setQuotes(data.quotes);
        setFilteredQuotes(data.quotes);
        setAuthors([...new Set(data.quotes.map((q) => q.author))]);
        setTimeout(() => setIsLoading(false), 300); // Small delay for smoother transition
      })
      .catch((error) => {
        console.error("Error fetching quotes:", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let updatedQuotes = quotes;

    if (selectedAuthor) {
      updatedQuotes = updatedQuotes.filter((q) => q.author === selectedAuthor);
    }

    if (search) {
      updatedQuotes = updatedQuotes.filter((q) =>
        q.quote.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredQuotes(updatedQuotes);
  }, [search, selectedAuthor, quotes]);

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(9)].map((_, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg shadow-lg relative animate-pulse"
        >
          {/* Quote text lines */}
          <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-md w-11/12 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-md w-4/5 mb-2"></div>

          {/* Author line */}
          <div className="h-4 bg-gray-200 rounded-md w-1/3 absolute bottom-2 right-2"></div>

          {/* Bookmark icon */}
          <div className="h-5 w-5 bg-gray-200 rounded-full absolute top-4 right-4"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900">Quote Explorer</h1>

        <Link
          to="/bookmarks"
          className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-600"
        >
          <i className="fas fa-bookmark"></i> My Bookmarks
        </Link>
      </header>

      <div className="flex items-center mb-6">
        <SearchBar search={search} onSearchChange={setSearch} />
        <FilterDropdown
          authors={authors}
          selectedAuthor={selectedAuthor}
          onFilterChange={setSelectedAuthor}
        />
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuotes.map((quote) => (
            <div
              key={quote.id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
            >
              <Link
                to={`/quote/${quote.id}`}
                className="text-lg text-gray-700 hover:text-blue-500 duration-400"
              >
                {quote.quote}
              </Link>{" "}
              <br />
              <p className="absolute bottom-2 right-2 text-gray-600">
                - {quote.author}
              </p>
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-purple-500 focus:outline-none"
                onClick={() => toggleBookmark(quote.id)}
              >
                <i
                  className={
                    bookmarkedQuotes.includes(quote.id)
                      ? "fas fa-bookmark"
                      : "far fa-bookmark"
                  }
                ></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuoteList;
