import { axiosClient } from '@shared/api/axiosClient.js'
import { ENDPOINTS } from '@shared/api/endpoints.js'

/** Matches the ADMINUSERS table, scoped to the current tenant by the
 * backend's EF Core global query filter -- no TenantId param needed here. */
export async function fetchAdminUsers() {
  const { data } = await axiosClient.get(ENDPOINTS.adminUsers.list)
  return data
}

/** @param {{ email: string, fullName: string, role: string }} payload
 * Backend should send an invite email; this call only creates the pending
 * ADMINUSERS row (IsActive=false until accepted). */
export async function inviteAdminUser(payload) {
  const { data } = await axiosClient.post(ENDPOINTS.adminUsers.invite, payload)
  return data
}

export async function updateAdminUserRole(id, role) {
  const { data } = await axiosClient.put(ENDPOINTS.adminUsers.updateRole(id), { role })
  return data
}

export async function deactivateAdminUser(id) {
  const { data } = await axiosClient.post(ENDPOINTS.adminUsers.deactivate(id))
  return data
}
