import axios from 'axios'
import { env } from '@app/config/env.js'
import { HTTP_HEADERS } from '@app/config/constants.js'
import { useAuthStore } from '@app/store/authStore.js'
import { useTenantStore } from '@app/store/tenantStore.js'

export const axiosClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 20_000,
})

axiosClient.interceptors.request.use((config) => {
  const requestUrl = (config.url ?? '').toLowerCase()
  const isAuthRoute = requestUrl.startsWith('/auth/') || requestUrl.startsWith('/api/auth/')
  const isIngestionRoute = requestUrl.includes('/ingestion/')

  const tenantId = useTenantStore.getState().tenantId || env.devTenantId
  const apiKey = useTenantStore.getState().apiKey || env.ingestionApiKey

  if (!isAuthRoute && tenantId) {
    config.headers[HTTP_HEADERS.TENANT_ID] = tenantId
  }

  if (apiKey) {
    config.headers[HTTP_HEADERS.API_KEY] = apiKey
  }

  const token = useAuthStore.getState().token
  if (token && !isIngestionRoute) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})


axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = (error.config?.url ?? '').toLowerCase()
    const isIngestionRoute = requestUrl.includes('/ingestion/')

    if (error.response?.status === 401 && !isIngestionRoute) {
      useAuthStore.getState().clearSession()
      useTenantStore.getState().clearTenant()
    }
    return Promise.reject(error)
  },
)
