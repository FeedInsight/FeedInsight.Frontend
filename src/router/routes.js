export const ROUTES = {
  //Feedback
  customerFeedback: '/feedback/:tenantKey',
  customerFeedbackDefault: '/feedback',

  // Auth
  login: '/login',
  register: '/register',

  // Admin Portal
  adminDashboard: '/admin/dashboard',
  workspaceDashboard: '/workspace/dashboard',
  superAdminDashboard: '/admin/dashboard',
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
