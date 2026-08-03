import { axiosClient } from '@shared/api/axiosClient.js'
import { ENDPOINTS } from '@shared/api/endpoints.js'

/**
 * Fetch list of customer feedback submissions for the AI Triage Inbox.
 * @param {{ search?: string, status?: string, page?: number, pageSize?: number }} params
 */
export async function fetchFeedbacks(params = {}) {
  const { data } = await axiosClient.get(ENDPOINTS.feedback.list, { params })
  return data
}

/**
 * Fetch detailed view for a single customer feedback item, including its extracted AI tasks.
 * @param {string} id
 */
export async function fetchFeedbackDetail(id) {
  const { data } = await axiosClient.get(ENDPOINTS.feedback.detail(id))
  return data
}
