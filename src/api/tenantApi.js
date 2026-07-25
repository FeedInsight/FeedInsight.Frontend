/**
 * src/api/tenantApi.js
 * ----------------------------------------------------------------------------
 * Multi-tenant resolution + tenant settings (Jira connection config).
 * Consumed by src/context/TenantContext.jsx (resolution) and
 * src/pages/admin/SettingsPage.jsx (Jira config CRUD).
 * ----------------------------------------------------------------------------
 */
import axiosClient from "./axiosClient";
import ENDPOINTS from "./endpoints";

/**
 * Used by the public Customer Portal to turn a subdomain/public key into a
 * TenantId before the feedback form is shown, so X-Tenant-Id can be attached
 * to the eventual submission.
 * @param {string} publicKey
 * @returns {Promise<{ tenantId: string, companyName: string }>}
 */
export function resolveTenantByKey(publicKey) {
  // TODO: GET ENDPOINTS.TENANT.RESOLVE_BY_KEY(publicKey)
  return axiosClient.get(ENDPOINTS.TENANT.RESOLVE_BY_KEY(publicKey));
}

/**
 * @returns {Promise<{ companyName, jiraBaseUrl, jiraConnected: boolean }>}
 * Note: jiraEncryptedToken / jiraWebhookSecret must NEVER be returned in
 * plaintext by the API — this call should only reflect connection status.
 */
export function fetchTenantSettings() {
  // TODO: GET ENDPOINTS.TENANT.SETTINGS
  return axiosClient.get(ENDPOINTS.TENANT.SETTINGS);
}

/**
 * @param {{ jiraBaseUrl: string, jiraApiToken: string }} payload
 */
export function updateTenantSettings(payload) {
  // TODO: PUT ENDPOINTS.TENANT.SETTINGS
  return axiosClient.put(ENDPOINTS.TENANT.SETTINGS, payload);
}
