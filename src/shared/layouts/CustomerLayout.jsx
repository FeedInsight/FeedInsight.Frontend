import { Outlet } from 'react-router-dom'

/**
 * Layout wrapper for the public Customer Portal (README §Customer Portal).
 * Deliberately minimal/stateless: no auth checks, no sidebar -- this is the
 * unauthenticated, tenant-branded surface where an end-user submits raw
 * feedback text + optional screenshots.
 *
 * If per-tenant branding (logo, color) is added later, resolve it here from
 * useTenantStore and apply as CSS variables/inline styles, not by forking
 * this layout per tenant.
 */
export default function CustomerLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <span className="text-lg font-semibold text-brand-600">FeedInsight</span>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
