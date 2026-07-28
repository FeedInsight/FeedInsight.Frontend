import { axiosClient } from '@shared/api/axiosClient'
import { ENDPOINTS } from '@shared/api/endpoints'

export const fetchTenants = async (params) => {
  const { data } = await axiosClient.get(ENDPOINTS.tenants.lookup, { params })
  return data
}