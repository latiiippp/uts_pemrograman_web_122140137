import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useBookmarks } from "../context/BookmarkContext";
import { useDocumentTitle } from "../hooks/useHooks";

const QuoteDetail = () => {
  const { quoteId } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use a ref for the quote container to implement animations
  const quoteContainerRef = useRef(null);

  // Use the bookmark context
  const { bookmarkedQuotes, toggleBookmark } = useBookmarks();

  // Memoize the numeric quote ID
  const numericQuoteId = useMemo(() => parseInt(quoteId), [quoteId]);

  // Memoize bookmark status check to avoid recalculation
  const isBookmarked = useMemo(
    () => bookmarkedQuotes.includes(numericQuoteId),
    [bookmarkedQuotes, numericQuoteId]
  );

  // Create a memoized toggle handler
  const handleToggleBookmark = useCallback(() => {
    toggleBookmark(numericQuoteId);

    // Apply animation effect when toggling bookmark
    if (quoteContainerRef.current) {
      quoteContainerRef.current.classList.add("pulse-animation");
      setTimeout(() => {
        if (quoteContainerRef.current) {
          quoteContainerRef.current.classList.remove("pulse-animation");
        }
      }, 300);
    }
  }, [numericQuoteId, toggleBookmark]);

  // Create a memoized navigation handler
  const handleBackNavigation = useCallback(() => {
    navigate("/");
  }, [navigate]);

  // Fetch quote data with useEffect
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    fetch(`https://dummyjson.com/quotes/${quoteId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            res.status === 404 ? "Quote not found" : "Server error"
          );
        }
        return res.json();
      })
      .then((data) => {
        setQuote(data);
        setTimeout(() => setIsLoading(false), 300);
      })
      .catch((error) => {
        console.error("Error fetching quote:", error);
        setError(error.message);
        setIsLoading(false);
      });
  }, [quoteId]);

  // Update document title when quote loads
  useDocumentTitle(
    quote
      ? `${quote.author} Quote - Quote Explorer`
      : "Loading Quote - Quote Explorer"
  );

  // Add CSS for the pulse animation
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.03); }
        100% { transform: scale(1); }
      }
      .pulse-animation {
        animation: pulse 0.3s ease-in-out;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full relative flex flex-col pb-12">
          {/* Skeleton UI components */}
          <div className="absolute top-4 right-4 w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="self-start w-full space-y-3">
            <div className="h-6 bg-gray-200 rounded-md w-full animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-md w-11/12 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-md w-full animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-md w-4/5 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
          </div>
          <div className="self-end h-6 bg-gray-200 rounded-md w-1/3 mt-8 animate-pulse"></div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-200 rounded-full w-14 h-14 animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-purple-500 animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Quote not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div
        ref={quoteContainerRef}
        className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full relative flex flex-col items-center pb-12"
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-purple-500 transition-colors duration-200 focus:outline-none"
          onClick={handleToggleBookmark}
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

        <button
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 border-4 border-gray-100 hover:border-purple-500 hover:transition-colors hover:duration-400"
          onClick={handleBackNavigation}
          aria-label="Back to quotes"
        >
          <FaArrowLeft className="text-purple-600" size={20} />
        </button>
      </div>
    </div>
  );
};

export default QuoteDetail;
