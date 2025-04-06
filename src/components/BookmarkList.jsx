import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaTrash } from "react-icons/fa";
import { useBookmarks } from "../context/BookmarkContext";
import ErrorMessage from "./ErrorHandling";

const BookmarkList = () => {
  const [bookmarkedQuotesData, setBookmarkedQuotesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use the bookmark context
  const { bookmarkedQuotes, toggleBookmark } = useBookmarks();

  useEffect(() => {
    if (bookmarkedQuotes.length === 0) {
      setBookmarkedQuotesData([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Fetch all quotes
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
        // Filter only bookmarked quotes using the context
        const bookmarked = data.quotes.filter((quote) =>
          bookmarkedQuotes.includes(quote.id)
        );
        setBookmarkedQuotesData(bookmarked);
        setIsLoading(false);
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
          setError({
            type: "generic",
            message: "Failed to load bookmarked quotes",
          });
        }
      });
  }, [bookmarkedQuotes]); // React to changes in bookmarkedQuotes from context

  // Function to handle bookmark removal
  const handleRemoveBookmark = (id) => {
    // Make sure we're working with the same type (number)
    toggleBookmark(Number(id));
  };

  // Loading skeleton
  const BookmarkLoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
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
          <div className="h-4 bg-gray-200 rounded-md w-1/3 mt-4"></div>

          {/* Delete icon */}
          <div className="h-5 w-5 bg-gray-200 rounded-full absolute top-4 right-4"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Link
          to="/"
          className="mr-4 text-purple-600 hover:text-purple-800"
          aria-label="Return to quote list"
        >
          <FaArrowLeft size={20} />
        </Link>
        <h1 className="text-4xl font-bold text-center flex-grow text-gray-800">
          My Bookmarks
        </h1>
      </div>

      {error ? (
        <ErrorMessage
          type={error.type}
          message={error.message}
          retry={() => {
            // Re-trigger the effect by creating a new array
            const currentBookmarks = [...bookmarkedQuotes];
            toggleBookmark(-1); // Toggle a non-existent ID to force update
            setTimeout(() => {
              // Restore the original bookmarks
              currentBookmarks.forEach((id) => {
                if (!bookmarkedQuotes.includes(id)) {
                  toggleBookmark(id);
                }
              });
            }, 10);
          }}
        />
      ) : isLoading ? (
        <BookmarkLoadingSkeleton />
      ) : bookmarkedQuotesData.length === 0 ? (
        <div
          className="text-center p-10 bg-gray-100 rounded-lg"
          aria-live="polite"
        >
          <p className="text-xl text-gray-600">No bookmarked quotes yet</p>
          <Link
            to="/"
            className="text-purple-600 hover:text-purple-800 mt-4 inline-block"
            aria-label="Return to quote list and add bookmarks"
          >
            Go back and bookmark some quotes
          </Link>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          aria-label="Your bookmarked quotes"
        >
          {bookmarkedQuotesData.map((quote) => (
            <div
              key={quote.id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
            >
              <Link
                to={`/quote/${quote.id}`}
                className="block text-lg text-gray-700 hover:text-purple-600"
                aria-label={`View quote by ${quote.author}`}
              >
                {quote.quote}
              </Link>
              <p className="text-gray-500 mt-2">- {quote.author}</p>
              <button
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-1"
                onClick={() => handleRemoveBookmark(quote.id)}
                aria-label={`Remove ${quote.author}'s quote from bookmarks`}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkList;
