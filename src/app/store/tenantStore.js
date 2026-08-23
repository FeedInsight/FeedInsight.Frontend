import { create } from 'zustand'

/**
 * Active tenant context, used by BOTH portals but resolved differently:
 *
 *  - Customer Portal: resolved by features/customerPortal/components/TenantResolver
 *    from the subdomain or a public tenant key in the URL, then written here
 *    once on mount. Read-only after that for the session.
 *  - Admin Portal: set from the authenticated AdminUser's TenantId (see
 *    authStore.user.tenantId) right after login -- an admin never switches
 *    tenants mid-session in this architecture (one login = one tenant).
 *
 * The shared axios client (shared/api/axiosClient.js) reads `tenantId` from
 * this store on every request and attaches it as the X-Tenant-Id header, so
 * feature code should never build that header manually.
 */
export const useTenantStore = create((set) => ({
  tenantId: null,
  companyName: null,
  apiKey: null,

  setTenant: (tenantId, companyName = null, apiKey = null) => set((state) => ({
    tenantId: tenantId ?? state.tenantId,
    companyName: companyName ?? state.companyName,
    apiKey: apiKey ?? state.apiKey,
  })),
  setApiKey: (apiKey) => set({ apiKey }),
  clearTenant: () => set({ tenantId: null, companyName: null, apiKey: null }),
}))
