import { axiosClient } from '@shared/api/axiosClient.js'
import { ENDPOINTS } from '@shared/api/endpoints.js'

export async function getIngestionKeys() {
  const { data } = await axiosClient.get(ENDPOINTS.apiSettings.ingestionKeys)
  return data
}
