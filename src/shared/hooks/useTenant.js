import { useTenantStore } from '@app/store/tenantStore.js'

export function useTenant() {
  const { tenantId, companyName, setTenant, clearTenant } = useTenantStore()
  return { tenantId, companyName, setTenant, clearTenant }
}
