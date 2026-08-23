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
 * Returns null gracefully if backend returns 404 or 400 so UI can fallback to cached list data.
 * @param {string} id
 */
export async function fetchFeedbackDetail(id) {
  if (!id) return null
  try {
    const { data } = await axiosClient.get(ENDPOINTS.feedback.detail(id))
    return data
  } catch (error) {
    const status = error.response?.status
    if (status === 404 || status === 400) {
      console.warn(`[triageApi] GET feedback detail for ID "${id}" returned HTTP ${status}. Using list data from cache.`)
      return null
    }
    throw error
  }
}

