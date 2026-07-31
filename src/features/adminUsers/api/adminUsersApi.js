import { axiosClient } from '@shared/api/axiosClient.js'
import { ENDPOINTS } from '@shared/api/endpoints.js'

export async function fetchProductOwners(params = {}) {
  const queryParams = {
    page: params.page,
    pageSize: params.pageSize,
  }

  if (params.searchTerm) {
    queryParams.SearchTerm = params.searchTerm
  }
  if (params.tenantId) {
    queryParams.TenantId = params.tenantId
  }
  if (params.status) {
    queryParams.IsActive = params.status === 'active' ? true : false
    console.log(queryParams.IsActive)
  }

  const response = await axiosClient.get(ENDPOINTS.users.productOwners, { params: queryParams })
  const payload = response.data

  const items = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.items)
      ? payload.items
      : Array.isArray(payload)
        ? payload
        : []

  const pagination = payload?.pagination ?? {}

  return {
    items,
    totalItems: pagination.totalItems,
    totalPages: pagination.totalPages,
    hasNextPage: pagination.hasNextPage,
    hasPreviousPage: pagination.hasPreviousPage,
    meta: payload?.meta,
  }
}

export async function fetchTenantLookup() {
  const response = await axiosClient.get(ENDPOINTS.tenants.lookup)
  const payload = response.data

  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  return []
}

export async function lockUser(id, reason = 'Locked via admin') {
  const { data } = await axiosClient.post(ENDPOINTS.users.lock(id), { reason })
  return data
}

export async function unlockUser(id) {
  const { data } = await axiosClient.post(ENDPOINTS.users.unlock(id))
  return data
}

export async function inviteAdminUser(payload) {
  const { data } = await axiosClient.post(ENDPOINTS.adminUsers.invite, payload)
  return data
}

export async function updateAdminUserRole(id, role) {
  const { data } = await axiosClient.put(ENDPOINTS.adminUsers.updateRole(id), { role })
  return data
}
