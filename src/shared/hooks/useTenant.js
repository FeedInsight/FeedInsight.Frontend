import { useTenantStore } from '@app/store/tenantStore.js'

/** Read/write access to the active tenant context. See tenantStore.js for
 * how Customer Portal vs Admin Portal resolve this differently. */
export function useTenant() {
  const { tenantId, companyName, setTenant, clearTenant } = useTenantStore()
  return { tenantId, companyName, setTenant, clearTenant }
}
