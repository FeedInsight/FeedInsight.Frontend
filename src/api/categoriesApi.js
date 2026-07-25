/**
 * src/api/categoriesApi.js
 * ----------------------------------------------------------------------------
 * Maps to Categories table ("Dynamic Category Management" — used as
 * classification targets by the Semantic Kernel Router Agent).
 * Consumed by src/store/slices/categoriesSlice.js and
 * src/components/adminPortal/categories/*.
 * ----------------------------------------------------------------------------
 */
import axiosClient from "./axiosClient";
import ENDPOINTS from "./endpoints";

export function fetchCategories() {
  // TODO: GET ENDPOINTS.CATEGORIES.LIST
  return axiosClient.get(ENDPOINTS.CATEGORIES.LIST);
}

/** @param {{ name: string, description?: string }} payload */
export function createCategory(payload) {
  // TODO: POST ENDPOINTS.CATEGORIES.CREATE
  return axiosClient.post(ENDPOINTS.CATEGORIES.CREATE, payload);
}

/** @param {string} id @param {{ name: string, description?: string }} payload */
export function updateCategory(id, payload) {
  // TODO: PUT ENDPOINTS.CATEGORIES.UPDATE(id)
  return axiosClient.put(ENDPOINTS.CATEGORIES.UPDATE(id), payload);
}

export function deleteCategory(id) {
  // TODO: DELETE ENDPOINTS.CATEGORIES.DELETE(id) — soft delete (IsDeleted bit)
  return axiosClient.delete(ENDPOINTS.CATEGORIES.DELETE(id));
}
