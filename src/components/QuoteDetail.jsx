import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBookmark, FaRegBookmark } from "react-icons/fa";

const QuoteDetail = () => {
  const { quoteId } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`https://dummyjson.com/quotes/${quoteId}`)
      .then((res) => res.json())
      .then((data) => {
        setQuote(data);
        setTimeout(() => setIsLoading(false), 300); // Add small delay for smoother transition
      })
      .catch((error) => {
        console.error("Error fetching quote:", error);
        setIsLoading(false);
      });

    // Check if this quote is bookmarked
    const bookmarkedQuotes = JSON.parse(
      localStorage.getItem("bookmarkedQuotes") || "[]"
    );
    setIsBookmarked(bookmarkedQuotes.includes(parseInt(quoteId)));
  }, [quoteId]);

  const toggleBookmark = () => {
    const bookmarkedQuotes = JSON.parse(
      localStorage.getItem("bookmarkedQuotes") || "[]"
    );
    const quoteIdInt = parseInt(quoteId);

    let newBookmarks;
    if (isBookmarked) {
      newBookmarks = bookmarkedQuotes.filter((id) => id !== quoteIdInt);
    } else {
      newBookmarks = [...bookmarkedQuotes, quoteIdInt];
    }

    localStorage.setItem("bookmarkedQuotes", JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 ">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full relative animate-pulse">
          {/* Bookmark icon placeholder */}
          <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-gray-200"></div>

          {/* Quote text placeholder */}
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-5 bg-gray-200 rounded w-full mb-3"></div>
          <div className="h-5 bg-gray-200 rounded w-5/6 mb-3"></div>
          <div className="h-5 bg-gray-200 rounded w-4/5 mb-3"></div>
          <div className="h-5 bg-gray-200 rounded w-2/3 mb-10"></div>

          {/* Author placeholder */}
          <div className="h-5 bg-gray-200 rounded w-1/3 self-end ml-auto"></div>

          {/* Back button placeholder */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-200 rounded-full w-14 h-14"></div>

          {/* Loading indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-400 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-xl text-red-600">Quote not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full relative flex flex-col items-center pb-12">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-purple-500 transition-colors duration-200 focus:outline-none"
          onClick={toggleBookmark}
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          {isBookmarked ? (
            <FaBookmark size={24} className="text-purple-500" />
          ) : (
            <FaRegBookmark size={24} />
          )}
        </button>

        <blockquote className="text-2xl font-serif italic text-gray-800 mb-6 self-start">
          "{quote.quote}"
        </blockquote>

        <p className="text-xl text-right text-gray-600 self-end mb-8">
          - {quote.author}
        </p>

        {/* Positioned back button that partially extends below the card */}
        <button
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 border-4 border-gray-100"
          onClick={() => navigate("/")}
          aria-label="Back to quotes"
        >
          <FaArrowLeft className="text-purple-600" size={20} />
        </button>
      </div>
    </div>
  );
};

export default QuoteDetail;
