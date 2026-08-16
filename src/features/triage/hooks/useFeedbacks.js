import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchFeedbacks, fetchFeedbackDetail } from '@features/triage/api/triageApi.js'
import { QUERY_KEYS } from '@app/config/constants.js'

/**
 * Hook to retrieve feedback items for the AI Triage Inbox.
 * @param {{ search?: string, status?: string, page?: number, pageSize?: number }} filters
 * @param {import('@tanstack/react-query').UseQueryOptions} [options]
 */
export function useFeedbacks(filters = {}, options = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.feedbacks, filters],
    queryFn: () => fetchFeedbacks(filters),
    ...options,
  })
}

/**
 * Hook to retrieve detailed feedback information and extracted AI tasks.
 * Prioritizes checking the cached feedbacks list first to avoid unnecessary 404/400 network calls.
 * @param {string} feedbackId
 */
export function useFeedbackDetail(feedbackId) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: QUERY_KEYS.feedbackDetail(feedbackId),
    queryFn: async () => {
      if (!feedbackId) return null

      // 1. Try fetching from backend detail endpoint first for complete fresh data & extracted tasks
      try {
        const detailData = await fetchFeedbackDetail(feedbackId)
        if (detailData) {
          return detailData?.data ?? detailData
        }
      } catch (err) {
        console.warn(`[useFeedbackDetail] Detail request failed for ${feedbackId}, checking cache...`, err)
      }

      // 2. Fallback to cached feedbacks list if detail call returned null or 404
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

