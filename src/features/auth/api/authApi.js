import { axiosClient } from '@shared/api/axiosClient.js'
import { ENDPOINTS } from '@shared/api/endpoints.js'

export async function login(credentials) {
  const { data } = await axiosClient.post(ENDPOINTS.auth.login, credentials)
  return data
}


export async function register(registrationData) {
  const { data } = await axiosClient.post(ENDPOINTS.auth.register, registrationData)
  return data
}

export async function registerAdmin(adminData) {
  const { data } = await axiosClient.post(ENDPOINTS.auth.registerAdmin, adminData)
  return data
}

export async function logout(tokens = {}) {
  try {
    const payload = tokens?.refreshToken
      ? { refreshToken: tokens.refreshToken }
      : tokens?.token
      ? { token: tokens.token }
      : {}
    await axiosClient.post(ENDPOINTS.auth.logout, payload, {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    // Silent catch so client-side logout completes smoothly without console errors
  }
}

export async function fetchCurrentUser() {
  const { data } = await axiosClient.get(ENDPOINTS.auth.me)
  return data
}
