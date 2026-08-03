import { useQuery } from '@tanstack/react-query'
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
 * @param {string} feedbackId
 */
export function useFeedbackDetail(feedbackId) {
  return useQuery({
    queryKey: QUERY_KEYS.feedbackDetail(feedbackId),
    queryFn: () => fetchFeedbackDetail(feedbackId),
    enabled: Boolean(feedbackId),
  })
}
