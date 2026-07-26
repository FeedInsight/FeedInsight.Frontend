import { useQuery } from '@tanstack/react-query'
import { fetchDailySnapshots } from '@features/dashboard/api/analyticsApi.js'
import { QUERY_KEYS } from '@app/config/constants.js'

/** @param {{ from: string, to: string }} range */
export function useDailySnapshots(range) {
  return useQuery({
    queryKey: QUERY_KEYS.dailySnapshots(range),
    queryFn: () => fetchDailySnapshots(range),
    enabled: Boolean(range?.from && range?.to),
  })
}
