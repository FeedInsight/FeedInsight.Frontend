import { axiosClient } from '@shared/api/axiosClient.js'
import { ENDPOINTS } from '@shared/api/endpoints.js'

export async function fetchCategories() {
  const response = await axiosClient.get(ENDPOINTS.categories.list)
  const payload = response.data

  return Array.isArray(payload?.data) ? payload.data : []
}

export async function createCategory(payload) {
  const body = {
    name: payload.name,
    description: payload.description ?? '',
  }

  const response = await axiosClient.post(ENDPOINTS.categories.create, body)
  return {
    id: response.data?.data?.id,
    name: body.name,
    description: body.description,
    isSystemDefault: false,
  }
}

export async function updateCategory(id, payload) {
  const body = {
    id,
    name: payload.name,
    description: payload.description ?? '',
  }

  await axiosClient.put(ENDPOINTS.categories.update, body)
  return {
    id,
    name: body.name,
    description: body.description,
  }
}

export async function deleteCategory(id) {
  await axiosClient.delete(ENDPOINTS.categories.remove(id))
  return { id }
}
