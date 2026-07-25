/**
 * src/hooks/usePagination.js
 * ----------------------------------------------------------------------------
 * Local pagination state (page, pageSize) + derived helpers, shared by any
 * list view backed by a server-paginated endpoint (Backlog Review, Feedback
 * list, Chat session list). Does NOT fetch data itself — pairs with a Redux
 * thunk or useFetch call that reads `page`/`pageSize` from here.
 * ----------------------------------------------------------------------------
 */
import { useState, useMemo } from "react";

export default function usePagination(initialPage = 1, initialPageSize = 20) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const goToNextPage = () => setPage((p) => p + 1);
  const goToPreviousPage = () => setPage((p) => Math.max(1, p - 1));
  const goToPage = (p) => setPage(Math.max(1, p));

  const paginationParams = useMemo(() => ({ page, pageSize }), [page, pageSize]);

  return {
    page,
    pageSize,
    setPageSize,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    paginationParams,
  };
}
