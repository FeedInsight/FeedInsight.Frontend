export const ROUTES = {
  notFound: '/404',

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
  workspaceAddProductOwner: '/workspace/add-product-owner',

  superAdminTenants: '/super-admin/tenants',
  superAdminUsers: '/super-admin/product-owners',
  superAdminAddAdmin: '/super-admin/add-super-admin',
  superAdminSettings: '/super-admin/settings',
}
