import { axiosClient } from '@shared/api/axiosClient.js'
import { ENDPOINTS } from '@shared/api/endpoints.js'
import { env } from '@app/config/env.js'

/**
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ token?: string, user?: { id?: string, tenantId?: string, fullName?: string, email?: string, role?: string }, refreshToken?: string }>} 
 */
export async function login(credentials) {
  if (env.isDev || env.useMocks) {
    return {
      token: 'demo-token',
      user: {
        id: 'demo-user',
        tenantId: 'demo-tenant',
        fullName: credentials?.email?.split('@')[0] || 'Demo User',
        email: credentials?.email || 'demo@example.com',
        role: 'Owner',
      },
    }
  }

  const { data } = await axiosClient.post(ENDPOINTS.auth.login, credentials)
  return data
}

/**
 * @param {{ companyName: string, firstName: string, lastName: string, email: string, password: string }} registrationData
 * @returns {Promise<{ token: string, user: { id, tenantId, fullName, email, role } }>}
 */
export async function register(registrationData) {
  const { data } = await axiosClient.post(ENDPOINTS.auth.register, registrationData)
  return data
}

/** Re-validates an existing token / refreshes `user` on app reload. */
export async function fetchCurrentUser() {
  if (env.isDev || env.useMocks) {
    return {
      id: 'demo-user',
      tenantId: 'demo-tenant',
      fullName: 'Demo User',
      email: 'demo@example.com',
      role: 'Owner',
    }
  }

  const { data } = await axiosClient.put(ENDPOINTS.auth.me, {})
  return data
}
