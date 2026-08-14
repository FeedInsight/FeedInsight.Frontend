import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@shared/hooks/useAuth.js'
import { canAccessApiKeys, canAccessCustomers, getDashboardRouteForRole } from '@shared/utils/roleUtils.js'
import { ROUTES } from './routes.js'

export default function ProtectedRoute({ requiredRoles }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (
    requiredRoles &&
    !requiredRoles.some(
      (r) => String(r).toLowerCase() === String(user?.role || '').toLowerCase(),
    )
  ) {
    const fallbackRoute = getDashboardRouteForRole(user?.role)
    return <Navigate to={fallbackRoute} replace />
  }

  // Development Product Owner restriction for Customers and Customer Feedbacks pages
  if (
    (location.pathname.startsWith('/workspace/customers') ||
      location.pathname.startsWith('/workspace/customer-feedbacks')) &&
    !canAccessCustomers(user?.role, user?.companyType)
  ) {
    return <Navigate to={ROUTES.workspaceDashboard} replace />
  }

  // Non-Development (Production) restriction for API Keys page
  if (location.pathname === '/workspace/api-keys' && !canAccessApiKeys(user?.companyType)) {
    return <Navigate to={ROUTES.workspaceDashboard} replace />
  }

  return <Outlet />
}

