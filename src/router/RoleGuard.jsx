import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@shared/hooks/useAuth.js'
import { getDashboardRouteForRole } from '@shared/utils/roleUtils.js'

/**
 * Role-based route guard for RBAC.
 * Checks if the logged-in user's role is included in `allowedRoles`.
 * If unauthorized, redirects the user to their role-appropriate dashboard.
 *
 * @param {{ allowedRoles: string[] }} props
 */
export default function RoleGuard({ allowedRoles }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    const fallbackRoute = getDashboardRouteForRole(user?.role)
    return <Navigate to={fallbackRoute} replace />
  }

  return <Outlet />
}
