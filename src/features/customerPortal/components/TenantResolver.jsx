import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTenant } from '@shared/hooks/useTenant.js'

/**
 * Resolves which tenant the Customer Portal is serving, per README:
 * "Identifies target context via custom header routing (X-Tenant-Id) mapped
 * from company-specific public keys or subdomains."
 *
 * Implementation notes (TODO once the backend tenant-lookup endpoint
 * exists):
 *  1. Read `tenantKey` from the URL param (e.g. /feedback/acme) OR parse
 *     `window.location.hostname` subdomain (acme.feedinsight.io).
 *  2. Call a public lookup endpoint (not yet in ENDPOINTS -- add
 *     `tenant.resolveByKey` there once available) to translate the
 *     human-readable key into the real TenantId GUID.
 *  3. useTenant().setTenant(tenantId, companyName) so axiosClient's request
 *     interceptor picks it up for the feedback submission call.
 *
 * Render this once near the top of CustomerFeedbackPage, above the form,
 * and show a loading/blocking state until tenant resolution completes so
 * FeedbackForm never fires a submit without a resolved tenant.
 */
export default function TenantResolver({ children }) {
  const { tenantKey } = useParams()
  const { setTenant } = useTenant()

  useEffect(() => {
    // TODO: replace with real lookup call once backend endpoint exists.
    if (tenantKey) {
      // Placeholder: assumes tenantKey IS the tenant GUID for now.
      setTenant(tenantKey, null)
    }
  }, [tenantKey, setTenant])

  return children
}
