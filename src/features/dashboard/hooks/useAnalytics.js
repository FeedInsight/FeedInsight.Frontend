import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@app/config/constants.js'
import { fetchAnalyticsSnapshots, fetchLatestAnalyticsSnapshot } from '../api/analyticsApi'

export const useLatestAnalyticsSnapshot = () => {
  return useQuery({
    queryKey: QUERY_KEYS.latestAnalyticsSnapshot,
    queryFn: fetchLatestAnalyticsSnapshot,
  })
}

export const useAnalyticsSnapshots = (range) => {
  return useQuery({
    queryKey: QUERY_KEYS.analyticsSnapshots(range),
    queryFn: () => fetchAnalyticsSnapshots({ from: range?.from, to: range?.to })
  })
}
