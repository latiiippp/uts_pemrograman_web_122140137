import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaTrash } from "react-icons/fa";
import { useBookmarks } from "../context/BookmarkContext";

const BookmarkList = () => {
  const [bookmarkedQuotesData, setBookmarkedQuotesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use the bookmark context
  const { bookmarkedQuotes, toggleBookmark } = useBookmarks();

  useEffect(() => {
    if (bookmarkedQuotes.length === 0) {
      setBookmarkedQuotesData([]);
      setIsLoading(false);
      return;
    }

    // Fetch all quotes
    fetch("https://dummyjson.com/quotes")
      .then((response) => response.json())
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
      });
  }, [bookmarkedQuotes]); // React to changes in bookmarkedQuotes from context

  // Function to handle bookmark removal
  const handleRemoveBookmark = (id) => {
    // Make sure we're working with the same type (number)
    toggleBookmark(Number(id));
  };

  if (isLoading)
    return <div className="text-center p-10">Loading bookmarks...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Link to="/" className="mr-4 text-purple-600 hover:text-purple-800">
          <FaArrowLeft size={20} />
        </Link>
        <h1 className="text-4xl font-bold text-center flex-grow text-gray-800">
          My Bookmarks
        </h1>
      </div>

      {bookmarkedQuotesData.length === 0 ? (
        <div className="text-center p-10 bg-gray-100 rounded-lg">
          <p className="text-xl text-gray-600">No bookmarked quotes yet</p>
          <Link
            to="/"
            className="text-purple-600 hover:text-purple-800 mt-4 inline-block"
          >
            Go back and bookmark some quotes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedQuotesData.map((quote) => (
            <div
              key={quote.id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
            >
              <Link
                to={`/quote/${quote.id}`}
                className="block text-lg text-gray-700 hover:text-purple-600"
              >
                {quote.quote}
              </Link>
              <p className="text-gray-500 mt-2">- {quote.author}</p>
              <button
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 focus:outline-none"
                onClick={() => handleRemoveBookmark(quote.id)}
                aria-label="Remove bookmark"
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
