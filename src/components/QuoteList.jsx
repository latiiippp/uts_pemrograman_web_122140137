import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import FilterDropdown from "./FilterDropdown";
import { useBookmarks } from "../context/BookmarkContext";
import ErrorMessage from "./ErrorHandling";
import Pagination from "./Pagination";
import {
  useDebounce,
  useDocumentTitle,
  useScrollToTop,
} from "../hooks/useHooks";

const QuoteList = () => {
  // Document title hook
  useDocumentTitle("Quote Explorer - Home");

  // State with useState hook
  const [quotes, setQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  // useRef to focus search input on component mount
  const searchInputRef = useRef(null);

  // useDebounce custom hook for search to prevent excessive filtering
  const debouncedSearch = useDebounce(search, 300);

  // Use the bookmark context
  const { bookmarkedQuotes, toggleBookmark } = useBookmarks();

  // useCallback to memoize function references
  const fetchQuotes = useCallback(() => {
    setIsLoading(true);
    setError(null);

    fetch("https://dummyjson.com/quotes")
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) throw new Error("not-found");
          if (response.status >= 500) throw new Error("server");
          throw new Error("unknown");
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
  }, []);

  // useCallback for page change handler
  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // useCallback for bookmark toggle with dependency on the toggleBookmark function
  const handleToggleBookmark = useCallback(
    (id) => {
      toggleBookmark(id);
    },
    [toggleBookmark]
  );

  // First useEffect for initial data fetch
  useEffect(() => {
    fetchQuotes();

    // Focus the search input when component mounts
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [fetchQuotes]);

  // Second useEffect for filtering quotes
  useEffect(() => {
    // Only filter when the debounced search changes
    let updatedQuotes = quotes;

    if (selectedAuthor) {
      updatedQuotes = updatedQuotes.filter((q) => q.author === selectedAuthor);
    }

    if (debouncedSearch) {
      updatedQuotes = updatedQuotes.filter((q) =>
        q.quote.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    setFilteredQuotes(updatedQuotes);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [debouncedSearch, selectedAuthor, quotes]);

  // Use useMemo to calculate pagination data to prevent recalculation on every render
  const paginationData = useMemo(() => {
    const indexOfLastQuote = currentPage * itemsPerPage;
    const indexOfFirstQuote = indexOfLastQuote - itemsPerPage;
    const currentQuotes = filteredQuotes.slice(
      indexOfFirstQuote,
      indexOfLastQuote
    );
    const totalPages = Math.ceil(filteredQuotes.length / itemsPerPage);

    return {
      currentQuotes,
      totalPages,
      showPagination: filteredQuotes.length > itemsPerPage,
    };
  }, [filteredQuotes, currentPage, itemsPerPage]);

  // Use custom scroll hook to scroll to top when page changes
  useScrollToTop(currentPage);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(itemsPerPage)].map((_, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg shadow-lg relative animate-pulse"
        >
          <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-md w-11/12 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-md w-4/5 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-md w-1/3 absolute bottom-2 right-2"></div>
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
          {bookmarkedQuotes.length > 0 && (
            <span className="ml-1">({bookmarkedQuotes.length})</span>
          )}
        </Link>
      </header>

      <div className="flex items-center mb-6">
        <SearchBar
          search={search}
          onSearchChange={setSearch}
          ref={searchInputRef}
        />
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
            {paginationData.currentQuotes.map((quote) => (
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
                  onClick={() => handleToggleBookmark(quote.id)}
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

          {paginationData.showPagination && (
            <Pagination
              currentPage={currentPage}
              totalPages={paginationData.totalPages}
              onPageChange={handlePageChange}
            />
          )}

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
                  setCurrentPage(1);
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
