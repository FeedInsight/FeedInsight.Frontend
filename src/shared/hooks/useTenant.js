import { useTenantStore } from '@app/store/tenantStore.js'

export function useTenant() {
  const { tenantId, companyName, apiKey, setTenant, setApiKey, clearTenant } = useTenantStore()
  return { tenantId, companyName, apiKey, setTenant, setApiKey, clearTenant }
}
