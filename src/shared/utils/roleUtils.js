import { ROLES } from '@app/config/constants.js'
import { ROUTES } from '@router/routes.js'

export function getDashboardRouteForRole(role) {
  if (role === ROLES.SUPER_ADMIN) {
    return ROUTES.superAdminTenants
  }

  if (role === ROLES.COMPANY_CUSTOMER) {
    return ROUTES.customerFeedback
  }

  return ROUTES.workspaceDashboard
}

export function isDevelopmentCompanyType(companyType) {
  return companyType === 'Development'
}

export function canAccessApiKeys(companyType) {
  return !isDevelopmentCompanyType(companyType)
}
