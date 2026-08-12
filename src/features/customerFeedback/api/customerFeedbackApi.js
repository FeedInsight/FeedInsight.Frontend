import { axiosClient } from '@shared/api/axiosClient.js'
import { ENDPOINTS } from '@shared/api/endpoints.js'

export async function submitCustomerFeedback(payload) {
  const { data } = await axiosClient.post(ENDPOINTS.customerFeedback.submit, payload)
  return data
}

export async function fetchCustomerFeedbackHistory() {
  const { data } = await axiosClient.get(ENDPOINTS.customerFeedback.history)
  return data
}
