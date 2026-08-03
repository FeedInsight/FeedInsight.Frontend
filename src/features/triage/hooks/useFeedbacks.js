import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchFeedbacks, fetchFeedbackDetail } from '@features/triage/api/triageApi.js'
import { QUERY_KEYS } from '@app/config/constants.js'

/**
 * Hook to retrieve feedback items for the AI Triage Inbox.
 * @param {{ search?: string, status?: string, page?: number, pageSize?: number }} filters
 */
export function useFeedbacks(filters = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.feedbacks, filters],
    queryFn: () => fetchFeedbacks(filters),
  })
}

/**
 * Hook to retrieve detailed feedback information and extracted AI tasks.
 * Falls back to finding the item in the cached feedbacks list if the API returns 404.
 * @param {string} feedbackId
 */
export function useFeedbackDetail(feedbackId) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: QUERY_KEYS.feedbackDetail(feedbackId),
    queryFn: async () => {
      // 1. Try backend detail endpoint
      const detailData = await fetchFeedbackDetail(feedbackId)
      if (detailData) return detailData

      // 2. Fallback: Search in active feedbacks list queries in cache
      const cachedQueries = queryClient.getQueriesData({ queryKey: QUERY_KEYS.feedbacks })
      for (const [, listData] of cachedQueries) {
        if (!listData) continue
        const items = Array.isArray(listData)
          ? listData
          : listData.items || listData.data || listData.$values || []
        const match = items.find((item) => String(item.id) === String(feedbackId))
        if (match) return match
      }

      return null
    },
    enabled: Boolean(feedbackId),
  })
}
