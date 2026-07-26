import { useState, useMemo } from 'react'

/**
 * Client-side pagination state helper for list views (AdminUsersTable,
 * CategoryList, BacklogReviewPage) whose endpoints return page/pageSize
 * query params. Keeps the (page, pageSize) tuple and exposes the derived
 * query-string params so api/*.js callers stay declarative:
 *
 *   const { page, pageSize, params, nextPage, prevPage } = usePagination()
 *   useQuery([...key, params], () => fetchList(params))
 */
export function usePagination(initialPageSize = 20) {
  const [page, setPage] = useState(1)
  const [pageSize] = useState(initialPageSize)

  const params = useMemo(() => ({ page, pageSize }), [page, pageSize])

  return {
    page,
    pageSize,
    params,
    nextPage: () => setPage((p) => p + 1),
    prevPage: () => setPage((p) => Math.max(1, p - 1)),
    setPage,
  }
}
