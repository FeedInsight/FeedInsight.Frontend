/**
 * src/utils/storage.js
 * ----------------------------------------------------------------------------
 * ONLY file allowed to touch localStorage directly. Everything else
 * (axiosClient, AuthContext, TenantContext) goes through these helpers so the
 * storage mechanism (localStorage vs sessionStorage vs cookie) can change in
 * one place later.
 * ----------------------------------------------------------------------------
 */
const AUTH_TOKEN_KEY = "feedinsight_auth_token";
const TENANT_ID_KEY = "feedinsight_tenant_id";

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function getTenantId() {
  return localStorage.getItem(TENANT_ID_KEY);
}

export function setTenantId(tenantId) {
  localStorage.setItem(TENANT_ID_KEY, tenantId);
}

/** Clears auth token only (used on 401 / explicit logout). Tenant id for the
 * Customer Portal is intentionally NOT cleared here — it's independent of
 * admin session state. */
export function clearAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}
