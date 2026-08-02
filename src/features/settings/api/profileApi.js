import { axiosClient } from "@shared/api/axiosClient"
import { ENDPOINTS } from "@shared/api/endpoints"

export async function updateProfile(payload) {
  const { data } = await axiosClient.put(ENDPOINTS.auth.me, payload)
  return data
}

export async function updatePassword(payload) {
  const { data } = await axiosClient.put(ENDPOINTS.auth.mePassword, payload)
  return data
}

export async function updateTenantProfile(payload) {
  const { data } = await axiosClient.put(ENDPOINTS.tenants.updateMyCompany, payload)
  return data
}
