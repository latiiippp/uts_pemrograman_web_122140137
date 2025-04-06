import { useState, useEffect, useRef, useCallback } from "react";

// Custom hook for debouncing values (e.g. search input)
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: clear timeout if value changes before delay expires
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Custom hook for tracking previous values
export function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// Custom hook for managing document title
export function useDocumentTitle(title) {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = title;

    // Restore original title on unmount
    return () => {
      document.title = originalTitle;
    };
  }, [title]);
}

// Custom hook for localStorage operations
export function useLocalStorage(key, initialValue) {
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function
  const setValue = useCallback(
    (value) => {
      try {
        // Allow value to be a function
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        // Save state and localStorage
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

// Custom hook for auto-scrolling to top on page changes
export function useScrollToTop(dependency) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [dependency]);
}
