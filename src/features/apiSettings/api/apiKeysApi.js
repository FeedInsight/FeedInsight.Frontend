import { axiosClient } from '@shared/api/axiosClient.js'
import { ENDPOINTS } from '@shared/api/endpoints.js'

export async function fetchApiKeys() {
  const { data } = await axiosClient.get(ENDPOINTS.apiKeys.list)
  return data
}

export async function createApiKey(payload) {
  const { data } = await axiosClient.post(ENDPOINTS.apiKeys.create, payload)
  return data
}
