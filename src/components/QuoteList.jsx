import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import FilterDropdown from "./FilterDropdown";
import { useBookmarks } from "../context/BookmarkContext";
import ErrorMessage from "./ErrorHandling";
import Pagination from "./Pagination";

const QuoteList = () => {
  const [quotes, setQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  // Use the bookmark context
  const { bookmarkedQuotes, toggleBookmark } = useBookmarks();

  const fetchQuotes = () => {
    setIsLoading(true);
    setError(null);

    fetch("https://dummyjson.com/quotes")
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("not-found");
          } else if (response.status >= 500) {
            throw new Error("server");
          } else {
            throw new Error("unknown");
          }
        }
        return response.json();
      })
      .then((data) => {
        setQuotes(data.quotes);
        setFilteredQuotes(data.quotes);
        setAuthors([...new Set(data.quotes.map((q) => q.author))]);
        setTimeout(() => setIsLoading(false), 300);
      })
      .catch((error) => {
        console.error("Error fetching quotes:", error);
        setIsLoading(false);

        if (error.message === "Failed to fetch") {
          setError({ type: "network" });
        } else if (error.message === "server") {
          setError({ type: "server" });
        } else if (error.message === "not-found") {
          setError({ type: "notFound" });
        } else {
          setError({ type: "generic", message: "Failed to load quotes" });
        }
      });
  };

  useEffect(() => {
    fetchQuotes();
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
    setCurrentPage(1); // Reset to first page when filter changes
  }, [search, selectedAuthor, quotes]);

  // Calculate pagination data
  const indexOfLastQuote = currentPage * itemsPerPage;
  const indexOfFirstQuote = indexOfLastQuote - itemsPerPage;
  const currentQuotes = filteredQuotes.slice(
    indexOfFirstQuote,
    indexOfLastQuote
  );
  const totalPages = Math.ceil(filteredQuotes.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(itemsPerPage)].map((_, index) => (
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
          aria-label="View your bookmarked quotes"
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

      {error ? (
        <ErrorMessage
          type={error.type}
          message={error.message}
          retry={fetchQuotes}
        />
      ) : isLoading ? (
        <LoadingSkeleton />
      ) : filteredQuotes.length === 0 ? (
        <div
          className="text-center p-10 bg-gray-100 rounded-lg"
          aria-live="polite"
        >
          <p className="text-xl text-gray-600">
            No quotes found matching your search
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedAuthor("");
            }}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            aria-label="Clear filters and show all quotes"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentQuotes.map((quote) => (
              <div
                key={quote.id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
              >
                <Link
                  to={`/quote/${quote.id}`}
                  className="text-lg text-gray-700 hover:text-blue-500 duration-400"
                  aria-label={`View quote by ${quote.author}`}
                >
                  {quote.quote}
                </Link>
                <p className="absolute bottom-2 right-2 text-gray-600">
                  - {quote.author}
                </p>
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-purple-500 focus:outline-none"
                  onClick={() => toggleBookmark(quote.id)}
                  aria-label={
                    bookmarkedQuotes.includes(quote.id)
                      ? "Remove from bookmarks"
                      : "Add to bookmarks"
                  }
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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          <div className="flex justify-end mt-4">
            <label
              htmlFor="items-per-page"
              className="mr-2 text-gray-700 flex items-center"
            >
              Items per page:
              <select
                id="items-per-page"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1); // Reset to first page
                }}
                className="ml-2 border border-gray-300 rounded p-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Select number of quotes per page"
              >
                <option value={6}>6</option>
                <option value={9}>9</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
              </select>
            </label>
          </div>
        </>
      )}
    </div>
  );
};

export default QuoteList;
