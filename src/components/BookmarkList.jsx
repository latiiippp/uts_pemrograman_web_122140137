// src/components/BookmarkList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const BookmarkList = () => {
  const [bookmarkedQuotes, setBookmarkedQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get bookmarked IDs from localStorage
    const bookmarkedIds = JSON.parse(
      localStorage.getItem("bookmarkedQuotes") || "[]"
    );

    if (bookmarkedIds.length === 0) {
      setIsLoading(false);
      return;
    }

    // Fetch all quotes
    fetch("https://dummyjson.com/quotes")
      .then((response) => response.json())
      .then((data) => {
        // Filter only bookmarked quotes
        const bookmarked = data.quotes.filter((quote) =>
          bookmarkedIds.includes(quote.id)
        );
        setBookmarkedQuotes(bookmarked);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching quotes:", error);
        setIsLoading(false);
      });
  }, []);

  const removeBookmark = (id) => {
    // Remove from state
    setBookmarkedQuotes((prev) => prev.filter((quote) => quote.id !== id));

    // Remove from localStorage
    const bookmarkedIds = JSON.parse(
      localStorage.getItem("bookmarkedQuotes") || "[]"
    );
    const updatedIds = bookmarkedIds.filter((bookmarkId) => bookmarkId !== id);
    localStorage.setItem("bookmarkedQuotes", JSON.stringify(updatedIds));
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

      {bookmarkedQuotes.length === 0 ? (
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
          {bookmarkedQuotes.map((quote) => (
            <div
              key={quote.id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
            >
              <p className="text-lg text-gray-700">{quote.quote}</p>
              <p className="text-gray-500 mt-2">- {quote.author}</p>
              <button
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 focus:outline-none"
                onClick={() => removeBookmark(quote.id)}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkList;
