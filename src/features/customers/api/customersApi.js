import { axiosClient } from '@shared/api/axiosClient.js'
import { ENDPOINTS } from '@shared/api/endpoints.js'

/**
 * Fetch paginated list of company customers for the current tenant.
 * @param {{ page?: number, pageSize?: number, searchTerm?: string }} params
 */
export async function fetchCompanyCustomers(params = {}) {
  const queryParams = {
    Page: params.page ?? params.Page ?? 1,
    PageSize: params.pageSize ?? params.PageSize ?? 10,
  }

  if (params.searchTerm ?? params.search) {
    queryParams.searchTerm = params.searchTerm ?? params.search
  }

  const { data } = await axiosClient.get(ENDPOINTS.customers.list, {
    params: queryParams,
  })
  return data
}

/**
 * Fetch detailed view for a single customer by id.
 * @param {string} id
 */
export async function fetchCompanyCustomerById(id) {
  if (!id) return null
  const { data } = await axiosClient.get(ENDPOINTS.customers.getById(id))
  return data?.data ?? data
}

/**
 * Create a new company customer for the tenant.
 * @param {{ firstName: string, lastName: string, email: string, password?: string }} payload
 */
export async function createCompanyCustomer(payload) {
  const { data } = await axiosClient.post(ENDPOINTS.customers.create, payload)
  return data?.data ?? data
}

/**
 * Delete a customer by id.
 * @param {string} id
 */
export async function deleteCustomer(id) {
  const { data } = await axiosClient.delete(ENDPOINTS.customers.remove(id))
  return data?.data ?? data
}

/**
 * Lock a company customer account.
 * POST /api/Customers/company-customers/{id}/lock
 * @param {string} id
 * @param {string} [reason] - Optional reason for locking
 */
export async function lockCompanyCustomer(id, reason) {
  const finalReason =
    typeof reason === 'string' && reason.trim()
      ? reason.trim()
      : 'Account locked by product owner'

  const payload = {
    reason: finalReason,
  }

  const { data } = await axiosClient.post(ENDPOINTS.customers.lock(id), payload)
  return data?.data ?? data
}

/**
 * Unlock a company customer account.
 * @param {string} id
 */
export async function unlockCompanyCustomer(id) {
  const { data } = await axiosClient.post(ENDPOINTS.customers.unlock(id))
  return data?.data ?? data
}
