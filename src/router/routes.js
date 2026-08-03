export const ROUTES = {
  customerFeedback: '/feedback/:tenantKey',
  customerFeedbackDefault: '/feedback',

  login: '/login',
  register: '/register',

  workspaceDashboard: '/workspace/dashboard',
  workspaceTriage: '/workspace/triage',
  workspaceTriageDetail: '/workspace/triage/:feedbackId',
  workspaceCategories: '/workspace/categories',
  workspaceBacklog: '/workspace/backlog',
  workspaceStoryDetail: '/workspace/backlog/:storyId',
  workspaceAssistant: '/workspace/assistant',
  workspaceSettings: '/workspace/settings',
  workspaceJiraIntegration: '/workspace/integrations',
  workspaceApiKeys: '/workspace/api-keys',

  superAdminTenants: '/super-admin/tenants',
  superAdminUsers: '/super-admin/users',
  superAdminSettings: '/super-admin/settings',
}
