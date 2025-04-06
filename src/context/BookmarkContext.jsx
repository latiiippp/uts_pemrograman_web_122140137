import React, { createContext, useContext, useCallback } from "react";
import { useLocalStorage } from "../hooks/useHooks";

// Create the context
const BookmarkContext = createContext();

// Create the custom hook for using the context
function useBookmarksData() {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error("useBookmarksData must be used within a BookmarkProvider");
  }
  return context;
}

// Create the provider component as a named function
function BookmarkProvider({ children }) {
  // Use our custom useLocalStorage hook instead of useState + useEffect
  const [bookmarkedQuotes, setBookmarkedQuotes] = useLocalStorage(
    "bookmarkedQuotes",
    []
  );

  // Function to toggle bookmark status with useCallback
  const toggleBookmark = useCallback(
    (quoteId) => {
      setBookmarkedQuotes((prevBookmarks) => {
        return prevBookmarks.includes(quoteId)
          ? prevBookmarks.filter((id) => id !== quoteId)
          : [...prevBookmarks, quoteId];
      });
    },
    [setBookmarkedQuotes]
  );

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
