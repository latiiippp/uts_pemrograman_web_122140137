import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import FilterDropdown from "./FilterDropdown";

const QuoteList = () => {
  const [quotes, setQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [authors, setAuthors] = useState([]);
  const [bookmarked, setBookmarked] = useState([]);

  useEffect(() => {
    // Load bookmarks from localStorage
    const savedBookmarks = JSON.parse(
      localStorage.getItem("bookmarkedQuotes") || "[]"
    );
    setBookmarked(savedBookmarks);

    fetch("https://dummyjson.com/quotes")
      .then((response) => response.json())
      .then((data) => {
        setQuotes(data.quotes);
        setFilteredQuotes(data.quotes);
        setAuthors([...new Set(data.quotes.map((q) => q.author))]);
      })
      .catch((error) => console.error("Error fetching quotes:", error));
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

  const toggleBookmark = (quoteId) => {
    setBookmarked((prev) => {
      let newBookmarks;
      if (prev.includes(quoteId)) {
        newBookmarks = prev.filter((id) => id !== quoteId);
      } else {
        newBookmarks = [...prev, quoteId];
      }

      // Save to localStorage
      localStorage.setItem("bookmarkedQuotes", JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  };

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
                  bookmarked.includes(quote.id)
                    ? "fas fa-bookmark"
                    : "far fa-bookmark"
                }
              ></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuoteList;
