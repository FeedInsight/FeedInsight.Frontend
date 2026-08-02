import { ROLES } from '@app/config/constants.js'
import { ROUTES } from '@router/routes.js'

/**
 * @param {string} role
 * @returns {string} Route path
 */
export function getDashboardRouteForRole(role) {
  if (role === ROLES.SUPER_ADMIN) {
    return ROUTES.superAdminTenants
  }
  return ROUTES.workspaceDashboard
}
