import { ROLES } from '@app/config/constants.js'
import { ROUTES } from '@router/routes.js'

export function isCompanyCustomer(role) {
  if (!role) return false
  const r = String(role).toLowerCase().replace(/[\s_-]/g, '')
  return r === 'companycustomer' || r === 'customercompany' || r === 'customer'
}

export function isDevelopmentCompanyType(companyType) {
  return String(companyType || '').toLowerCase() === 'development'
}

export function canAccessCustomers(role, companyType) {
  const isPO = role === ROLES.PRODUCT_OWNER || String(role || '').toLowerCase() === 'productowner'
  return isPO && isDevelopmentCompanyType(companyType)
}

export function canAccessApiKeys(companyType) {
  return !isDevelopmentCompanyType(companyType)
}

export function getDashboardRouteForRole(role) {
  if (role === ROLES.SUPER_ADMIN || String(role || '').toLowerCase() === 'superadmin') {
    return ROUTES.superAdminTenants
  }

  if (isCompanyCustomer(role)) {
    return ROUTES.customerFeedback
  }

  return ROUTES.workspaceDashboard
}

