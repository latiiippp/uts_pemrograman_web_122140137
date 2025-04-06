import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuoteList from "./components/QuoteList";
import QuoteDetail from "./components/QuoteDetail";
import BookmarkList from "./components/BookmarkList";
import { BookmarkProvider } from "./context/BookmarkContext";

const App = () => {
  return (
    <BookmarkProvider>
      <Router>
        <Routes>
          <Route path="/" element={<QuoteList />} />
          <Route path="/quote/:quoteId" element={<QuoteDetail />} />
          <Route path="/bookmarks" element={<BookmarkList />} />
        </Routes>
      </Router>
    </BookmarkProvider>
  );
};

export default App;
