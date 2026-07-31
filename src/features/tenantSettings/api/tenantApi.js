import { axiosClient } from '@shared/api/axiosClient.js'
import { ENDPOINTS } from '@shared/api/endpoints.js'

export async function fetchTenantSettings() {
  const { data } = await axiosClient.get(ENDPOINTS.tenant.settings)
  return data
}

/** @param {{ companyName?: string, jiraBaseUrl?: string, jiraApiToken?: string }} payload */
export async function updateTenantSettings(payload) {
  const { data } = await axiosClient.put(ENDPOINTS.tenant.settings, payload)
  return data
}

export async function testJiraConnection() {
  const { data } = await axiosClient.post(ENDPOINTS.tenant.testJiraConnection)
  return data
}

export async function configureJiraIntegration(payload) {
  const { data } = await axiosClient.post(ENDPOINTS.tenant.configureJiraIntegration, payload)
  return data
}

export async function regenerateWebhookSecret() {
  const { data } = await axiosClient.post(ENDPOINTS.tenant.regenerateWebhookSecret)
  return data
}
