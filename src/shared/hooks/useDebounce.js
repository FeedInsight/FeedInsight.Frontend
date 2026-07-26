import { useEffect, useState } from 'react'

/**
 * Generic debounce hook. Primary use case: debouncing the search input in
 * BacklogReviewPage / CategoriesPage before firing a filtered React Query
 * request, so we don't re-fetch on every keystroke.
 */
export function useDebounce(value, delayMs = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])

  return debounced
}
