import { axiosClient } from '@shared/api/axiosClient.js'
import { ENDPOINTS } from '@shared/api/endpoints.js'

/**
 * Submit customer feedback via the development customer endpoint.
 * Sends rawContent directly without metadataJson.
 * @param {{ rawContent: string }} payload
 */
export async function submitDevelopmentCustomerFeedback(payload) {
  const body = {
    rawContent: payload.rawContent || payload.description || payload.content || '',
  }
  const { data } = await axiosClient.post(ENDPOINTS.developmentFeedback.customerSubmit, body)
  return data?.data ?? data
}

/**
 * Fetch paginated list of feedback submitted by the authenticated customer.
 * @param {{ page?: number, pageSize?: number }} params
 */
export async function fetchDevelopmentCustomerFeedbacks(params = {}) {
  const queryParams = {
    Page: params.page ?? params.Page ?? 1,
    PageSize: params.pageSize ?? params.PageSize ?? 10,
  }
  const { data } = await axiosClient.get(ENDPOINTS.developmentFeedback.customerList, {
    params: queryParams,
  })
  return data
}

/**
 * Fetch paginated list of all customer feedbacks for the development tenant/company (Product Owner).
 * @param {{ page?: number, pageSize?: number }} params
 */
export async function fetchDevelopmentCompanyFeedbacks(params = {}) {
  const queryParams = {
    Page: params.page ?? params.Page ?? 1,
    PageSize: params.pageSize ?? params.PageSize ?? 10,
  }
  const { data } = await axiosClient.get(ENDPOINTS.developmentFeedback.companyList, {
    params: queryParams,
  })
  return data
}

/**
 * Add a comment to a customer feedback item (Development Product Owner only).
 * @param {string} feedbackId
 * @param {{ content: string }} payload
 */
export async function addDevelopmentCompanyComment(feedbackId, payload) {
  const body = {
    content: payload.content || payload.message || payload.comment || '',
  }
  const { data } = await axiosClient.post(
    ENDPOINTS.developmentFeedback.addCompanyComment(feedbackId),
    body,
  )
  return data?.data ?? data
}

/**
 * Legacy alias for customer feedback submission
 */
export async function submitCustomerFeedback(payload) {
  return submitDevelopmentCustomerFeedback(payload)
}

/**
 * Legacy alias for customer feedback history
 */
export async function fetchCustomerFeedbackHistory(params = {}) {
  return fetchDevelopmentCustomerFeedbacks(params)
}
