import { axiosClient } from '@shared/api/axiosClient.js'
import { ENDPOINTS } from '@shared/api/endpoints.js'

export async function getProfile() {
  const { data } = await axiosClient.get(ENDPOINTS.profile.update)
  return data?.data
}

export async function updateProfile(payload) {
  const body = {
    firstName: payload.firstName,
    lastName: payload.lastName,
  }
  const { data } = await axiosClient.put(ENDPOINTS.profile.update, body)
  return data
}

export async function updatePassword(payload) {
  const body = {
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword,
  }
  const { data } = await axiosClient.put(ENDPOINTS.profile.updatePassword, body)
  return data
}
