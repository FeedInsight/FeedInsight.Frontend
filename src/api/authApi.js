/**
 * src/api/authApi.js
 * ----------------------------------------------------------------------------
 * Admin Portal authentication calls only (JWT role-based auth per README).
 * Consumed exclusively by src/context/AuthContext.jsx — no component or page
 * should import this directly; they should use the `useAuth()` hook instead.
 * ----------------------------------------------------------------------------
 */
import axiosClient from "./axiosClient";
import ENDPOINTS from "./endpoints";

/**
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ token: string, user: { id, fullName, email, role, tenantId } }>}
 */
export function login(credentials) {
  // TODO: POST ENDPOINTS.AUTH.LOGIN with credentials
  return axiosClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
}

export function logout() {
  // TODO: POST ENDPOINTS.AUTH.LOGOUT (invalidate refresh token server-side, if any)
  return axiosClient.post(ENDPOINTS.AUTH.LOGOUT);
}

/**
 * @returns {Promise<{ id, fullName, email, role, tenantId }>}
 */
export function fetchCurrentUser() {
  // TODO: GET ENDPOINTS.AUTH.ME — used on app load to rehydrate session from stored JWT
  return axiosClient.get(ENDPOINTS.AUTH.ME);
}

export function requestPasswordReset(email) {
  // TODO: POST ENDPOINTS.AUTH.FORGOT_PASSWORD
  return axiosClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
}
