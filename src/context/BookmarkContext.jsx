import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const BookmarkContext = createContext();

// Create a named function for the custom hook (important for Vite's Fast Refresh)
function useBookmarksData() {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error("useBookmarksData must be used within a BookmarkProvider");
  }
  return context;
}

// Create the provider component as a named function
function BookmarkProvider({ children }) {
  const [bookmarkedQuotes, setBookmarkedQuotes] = useState([]);

  // Load bookmarks from localStorage on initial render
  useEffect(() => {
    const savedBookmarks = JSON.parse(
      localStorage.getItem("bookmarkedQuotes") || "[]"
    );
    setBookmarkedQuotes(savedBookmarks);
  }, []);

  // Function to toggle bookmark status
  function toggleBookmark(quoteId) {
    setBookmarkedQuotes((prevBookmarks) => {
      const newBookmarks = prevBookmarks.includes(quoteId)
        ? prevBookmarks.filter((id) => id !== quoteId)
        : [...prevBookmarks, quoteId];

      // Save to localStorage
      localStorage.setItem("bookmarkedQuotes", JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  }

  // Value to be provided by the context
  const value = {
    bookmarkedQuotes,
    toggleBookmark,
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
}

// Export both the hook and provider
export { BookmarkProvider, useBookmarksData as useBookmarks };
