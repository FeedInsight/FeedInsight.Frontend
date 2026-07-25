/**
 * src/hooks/useDebounce.js
 * ----------------------------------------------------------------------------
 * Debounces a fast-changing value. Primary use case: the Backlog Review
 * Workspace search/filter input and the Categories search box, to avoid
 * firing a fetch on every keystroke.
 * ----------------------------------------------------------------------------
 */
import { useState, useEffect } from "react";

export default function useDebounce(value, delayMs = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
