import { axiosClient } from '@shared/api/axiosClient.js'
import { ENDPOINTS } from '@shared/api/endpoints.js'

/**
 * Update personal profile information (first and last name)
 * PUT /api/Profile/me
 * @param {{ firstName: string, lastName: string }} payload
 */
export async function updateProfile(payload) {
  const body = {
    firstName: payload.firstName,
    lastName: payload.lastName,
  }
  const { data } = await axiosClient.put(ENDPOINTS.profile.update, body)
  return data
}

/**
 * Update account password
 * PUT /api/Profile/me/password
 * @param {{ currentPassword: string, newPassword: string }} payload
 */
export async function updatePassword(payload) {
  const body = {
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword,
  }
  const { data } = await axiosClient.put(ENDPOINTS.profile.updatePassword, body)
  return data
}
