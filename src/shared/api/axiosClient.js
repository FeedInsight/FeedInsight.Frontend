import axios from 'axios'
import { env } from '@app/config/env.js'
import { HTTP_HEADERS } from '@app/config/constants.js'
import { ENDPOINTS } from '@shared/api/endpoints.js'
import { useAuthStore } from '@app/store/authStore.js'
import { useTenantStore } from '@app/store/tenantStore.js'

export const axiosClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 20_000,
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

axiosClient.interceptors.request.use((config) => {
  const requestUrl = (config.url ?? '').toLowerCase()
  const isAuthRoute = requestUrl.startsWith('/auth/')
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
  async (error) => {
    const originalRequest = error.config
    if (!originalRequest) return Promise.reject(error)

    const requestUrl = (originalRequest.url ?? '').toLowerCase()
    const isAuthRoute =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/refresh')
    const isIngestionRoute = requestUrl.includes('/ingestion/')

    if (error.response?.status === 401 && !isIngestionRoute && !isAuthRoute && !originalRequest._retry) {
      const { token, refreshToken, updateToken, clearSession } = useAuthStore.getState()

      if (refreshToken) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then((newToken) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              return axiosClient(originalRequest)
            })
            .catch((err) => Promise.reject(err))
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          const refreshUrl = `${env.apiBaseUrl}${ENDPOINTS.auth.refresh}`
          const response = await axios.post(
            refreshUrl,
            { token, accessToken: token, refreshToken },
            {
              headers: {
                'Content-Type': 'application/json',
                [HTTP_HEADERS.TENANT_ID]: useTenantStore.getState().tenantId || env.devTenantId,
              },
            },
          )

          const data = response?.data?.data ?? response?.data
          const newToken = data?.accessToken ?? data?.token
          const newRefreshToken = data?.refreshToken ?? refreshToken

          if (newToken) {
            updateToken(newToken, newRefreshToken)
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            processQueue(null, newToken)
            return axiosClient(originalRequest)
          } else {
            throw new Error('Refresh response missing token')
          }
        } catch (refreshError) {
          processQueue(refreshError, null)
          clearSession()
          useTenantStore.getState().clearTenant()
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      } else {
        clearSession()
        useTenantStore.getState().clearTenant()
      }
    }

    return Promise.reject(error)
  },
)

