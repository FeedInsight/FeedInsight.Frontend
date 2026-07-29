import { ADMIN_ROLES } from '@app/config/constants.js'
import { ROUTES } from '@router/routes.js'

/**
 * Returns the default home dashboard path based on the user's role.
 *
 * Role mapping:
 *  - SuperAdmin (OWNER) -> /super-admin/dashboard
 *  - ProductManager / Viewer -> /workspace/dashboard
 *
 * @param {string} role
 * @returns {string} Route path
 */
export function getDashboardRouteForRole(role) {
  if (role === ADMIN_ROLES.OWNER) {
    return ROUTES.superAdminDashboard
  }
  return ROUTES.workspaceDashboard
}
