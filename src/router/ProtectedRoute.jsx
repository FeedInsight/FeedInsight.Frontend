import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@shared/hooks/useAuth.js'

/**
 * Route guard for every /admin/* screen. Redirects to /login when there is
 * no valid session. Role-based gating (e.g. Viewer cannot open
 * TenantSettings) is intentionally NOT done here -- that's too coarse for a
 * whole-route decision here since most admin pages are shared across
 * roles; instead gate individual actions/buttons inline using
 * shared/constants/roles.js so a restricted-role user still sees the page
 * in a read-only state rather than being redirected away entirely.
 *
 * `requiredRoles` is an optional escape hatch for the few pages (Tenant
 * Settings, Admin Users) that truly should be inaccessible outright.
 */
export default function ProtectedRoute({ requiredRoles }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRoles && !requiredRoles.includes(user?.role)) {
    return <Navigate to="/admin/dashboard" replace />
  }

  return <Outlet />
}
