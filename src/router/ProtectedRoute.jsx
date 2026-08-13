import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@shared/hooks/useAuth.js'
import { canAccessApiKeys, getDashboardRouteForRole } from '@shared/utils/roleUtils.js'
import { ROUTES } from './routes.js'

export default function ProtectedRoute({ requiredRoles }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRoles && !requiredRoles.includes(user?.role)) {
    const fallbackRoute = getDashboardRouteForRole(user?.role)
    return <Navigate to={fallbackRoute} replace />
  }

  if (location.pathname === '/workspace/api-keys' && !canAccessApiKeys(user?.companyType)) {
    return <Navigate to={ROUTES.workspaceDashboard} replace />
  }

  return <Outlet />
}
