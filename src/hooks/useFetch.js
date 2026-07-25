/**
 * src/hooks/useFetch.js
 * ----------------------------------------------------------------------------
 * Generic async-data hook for simple GET-and-display cases that don't need
 * full Redux (e.g. a one-off settings page fetch). Domain lists that are
 * reused across multiple pages/components (stories, categories, chat
 * sessions) should go through Redux slices instead — use this only for
 * page-local, non-shared data.
 *
 * Usage:
 *   const { data, isLoading, error, refetch } = useFetch(() => tenantApi.fetchTenantSettings(), []);
 * ----------------------------------------------------------------------------
 */
import { useState, useEffect, useCallback } from "react";

export default function useFetch(fetcherFn, deps = []) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const run = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcherFn();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { data, isLoading, error, refetch: run };
}
