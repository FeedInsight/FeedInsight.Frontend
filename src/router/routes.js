/**
 * Path constants. Import from here in <Link>/<NavLink>/navigate() calls
 * instead of hardcoding strings, so a path rename is a one-file change.
 * Keep in sync with the <Route path> values in AppRouter.jsx.
 */
export const ROUTES = {
  // Customer Portal (public)
  customerFeedback: '/feedback/:tenantKey', // e.g. /feedback/acme -> resolves tenant via TenantResolver
  customerFeedbackDefault: '/feedback',

  // Auth
  login: '/login',
  register: '/register',

  // Admin Portal
  adminDashboard: '/admin/dashboard',
  workspaceDashboard: '/workspace/dashboard',
  superAdminDashboard: '/super-admin/dashboard',
  adminCategories: '/admin/categories',
  adminBacklog: '/admin/backlog',
  adminStoryDetail: '/admin/backlog/:storyId',
  adminAssistant: '/admin/assistant',
  adminUsers: '/admin/users',
  adminSettings: '/admin/settings',
  jiraIntegrationSettings: '/workspace/settings/integrations',
  apiSettings: '/workspace/api-settings',

  tenantsDirectory: '/super-admin/tenants',
}
