export const ROUTES = {
  customerFeedback: '/feedback/:tenantKey',
  customerFeedbackDefault: '/feedback',

  login: '/login',
  register: '/register',

  workspaceDashboard: '/workspace/dashboard',
  workspaceCategories: '/workspace/categories',
  workspaceBacklog: '/workspace/backlog',
  workspaceStoryDetail: '/workspace/backlog/:storyId',
  workspaceAssistant: '/workspace/assistant',
  workspaceSettings: '/workspace/settings',
  workspaceJiraIntegration: '/workspace/integrations',
  workspaceApiSettings: '/workspace/api-settings',

  superAdminTenants: '/super-admin/tenants',
  superAdminUsers: '/super-admin/users',
}
