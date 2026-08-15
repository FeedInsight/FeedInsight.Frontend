import { axiosClient } from '@shared/api/axiosClient.js'
import { ENDPOINTS } from '@shared/api/endpoints.js'

/**
 * Fetch current tenant settings and company profile.
 * GET /api/Tenants/my-company
 */
export async function fetchTenantSettings() {
  const { data } = await axiosClient.get(ENDPOINTS.tenant.settings)
  return data?.data ?? data
}

/**
 * Update tenant company name for Product Owner (Production & Development).
 * PUT /api/Tenants/my-company
 * @param {{ companyName: string }} payload
 */
export async function updateTenantCompany(payload) {
  const body = {
    companyName: payload.companyName || payload.name || '',
  }
  const { data } = await axiosClient.put(ENDPOINTS.tenant.updateMyCompany, body)
  return data?.data ?? data
}

/**
 * Alias for tenant settings update
 */
export async function updateTenantSettings(payload) {
  return updateTenantCompany(payload)
}
