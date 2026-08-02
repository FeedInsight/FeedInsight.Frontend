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

export async function logout() {
  try {
    await axiosClient.post(ENDPOINTS.auth.logout)
  } catch (error) {
    console.warn('Backend logout call failed or endpoint unavailable:', error)
  }
}

export async function fetchCurrentUser() {
  const { data } = await axiosClient.get(ENDPOINTS.auth.me)
  return data
}
