import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@shared/hooks/useAuth.js'
import { getDashboardRouteForRole } from '@shared/utils/roleUtils.js'

export default function ProtectedRoute({ requiredRoles }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRoles && !requiredRoles.includes(user?.role)) {
    const fallbackRoute = getDashboardRouteForRole(user?.role)
    return <Navigate to={fallbackRoute} replace />
  }

  return <Outlet />
}
