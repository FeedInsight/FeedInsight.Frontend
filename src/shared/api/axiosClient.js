import axios from 'axios'
import { env } from '@app/config/env.js'
import { HTTP_HEADERS } from '@app/config/constants.js'
import { useAuthStore } from '@app/store/authStore.js'
import { useTenantStore } from '@app/store/tenantStore.js'

/**
 * The ONE axios instance used by every feature's api/*.js file. Do not call
 * axios.create() anywhere else in the codebase -- all tenant resolution,
 * auth-token attachment, and 401/403 handling must stay centralized here or
 * they will silently diverge between features.
 */
export const axiosClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 20_000,
})

/**
 * Request interceptor: attaches X-Tenant-Id (required by the backend's
 * global EF Core tenant query filter) and the admin Bearer token when
 * present. Customer Portal requests will have a token of `null` and simply
 * skip the Authorization header -- the public feedback endpoint only needs
 * the tenant header.
 */
axiosClient.interceptors.request.use((config) => {
  const requestUrl = (config.url ?? '').toLowerCase()
  const isAuthRoute = requestUrl.startsWith('/auth/') || requestUrl.startsWith('/api/auth/')
  const tenantId = useTenantStore.getState().tenantId || env.devTenantId

  if (!isAuthRoute && tenantId) {
    config.headers[HTTP_HEADERS.TENANT_ID] = tenantId
  }

  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

/**
 * Response interceptor: normalizes error handling.
 *  - 401 -> session expired/invalid: clear auth store & tenant store, let
 *    ProtectedRoute redirect to /login on next render.
 *  - Anything else is re-thrown as-is so React Query / calling hooks can
 *    surface `error.response.data` (expected to be a ProblemDetails-style
 *    payload from the Global Exception Handler middleware) to the UI.
 */
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearSession()
      useTenantStore.getState().clearTenant()
    }
    return Promise.reject(error)
  },
)
