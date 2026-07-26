import { axiosClient } from '@shared/api/axiosClient.js'
import { ENDPOINTS } from '@shared/api/endpoints.js'

/** Matches the Categories SQL table. These are the "Dynamic Category
 * Management" classification targets the Router Agent uses (README §Admin
 * Portal), so mutations here should stay simple CRUD -- no AI logic. */
export async function fetchCategories() {
  const { data } = await axiosClient.get(ENDPOINTS.categories.list)
  return data
}

/** @param {{ name: string, description?: string }} payload */
export async function createCategory(payload) {
  const { data } = await axiosClient.post(ENDPOINTS.categories.create, payload)
  return data
}

/** @param {string} id @param {{ name: string, description?: string }} payload */
export async function updateCategory(id, payload) {
  const { data } = await axiosClient.put(ENDPOINTS.categories.update(id), payload)
  return data
}

/** Soft delete (sets IsDeleted, per README's global soft-deletion note). */
export async function deleteCategory(id) {
  const { data } = await axiosClient.delete(ENDPOINTS.categories.remove(id))
  return data
}
