import { axiosClient } from '@shared/api/axiosClient.js'
import { ENDPOINTS } from '@shared/api/endpoints.js'

/**
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ token: string, user: { id, tenantId, fullName, email, role } }>}
 * Expected to match AdminUsers table fields + a signed JWT. The JWT's
 * `tenantId` claim is what gets pushed into tenantStore right after login
 * (see useLogin.js) so every subsequent request is scoped correctly.
 */
export async function login(credentials) {
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
  const { data } = await axiosClient.get(ENDPOINTS.auth.me)
  return data
}
