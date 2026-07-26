import { axiosClient } from '@shared/api/axiosClient.js'
import { ENDPOINTS } from '@shared/api/endpoints.js'

/** Reads/updates the TENANTS row's Jira fields (JiraBaseUrl,
 * JiraEncryptedToken -- write-only from the client, JiraWebhookSecret is
 * shown once on regeneration only, never re-fetched in plaintext). */
export async function fetchTenantSettings() {
  const { data } = await axiosClient.get(ENDPOINTS.tenant.settings)
  return data
}

/** @param {{ companyName?: string, jiraBaseUrl?: string, jiraApiToken?: string }} payload */
export async function updateTenantSettings(payload) {
  const { data } = await axiosClient.put(ENDPOINTS.tenant.settings, payload)
  return data
}

/** Verifies the configured Jira credentials actually authenticate before
 * saving, used by JiraConnectionForm's "Test connection" button. */
export async function testJiraConnection() {
  const { data } = await axiosClient.post(ENDPOINTS.tenant.testJiraConnection)
  return data
}

/** Rotates JiraWebhookSecret; backend returns the new plaintext secret
 * exactly once for the admin to copy into their Jira webhook config. */
export async function regenerateWebhookSecret() {
  const { data } = await axiosClient.post(ENDPOINTS.tenant.regenerateWebhookSecret)
  return data
}
