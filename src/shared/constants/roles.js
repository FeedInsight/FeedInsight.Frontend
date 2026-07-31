import { ADMIN_ROLES } from '@app/config/constants.js'

/**
 * Permission matrix consumed by ProtectedRoute and any component that needs
 * to hide/disable actions by role (e.g. only Owner/ProductManager can edit
 * TenantSettings or invite AdminUsers; Viewer is read-only across the app).
 * Extend this object rather than sprinkling `role === 'Owner'` checks
 * throughout feature components.
 */
export const CAN_MANAGE_TENANT_SETTINGS = [ADMIN_ROLES.OWNER]
export const CAN_MANAGE_ADMIN_USERS = [ADMIN_ROLES.OWNER]
export const CAN_APPROVE_STORIES = [ADMIN_ROLES.OWNER, ADMIN_ROLES.PRODUCT_MANAGER]
export const CAN_MANAGE_CATEGORIES = [ADMIN_ROLES.OWNER, ADMIN_ROLES.PRODUCT_MANAGER]
export const CAN_VIEW_ALL_TENANTS = [ADMIN_ROLES.OWNER]
