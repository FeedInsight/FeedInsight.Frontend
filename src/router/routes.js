export const ROUTES = {
  notFound: '/404',

  landing: '/',

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
  workspaceCustomers: '/workspace/customers',
  workspaceAddCustomer: '/workspace/customers/new',
  workspaceCustomerDetail: '/workspace/customers/:customerId',
  workspaceCustomerFeedbacks: '/workspace/customer-feedbacks',

  superAdminTenants: '/super-admin/tenants',
  superAdminUsers: '/super-admin/product-owners',
  superAdminAddAdmin: '/super-admin/add-super-admin',
  superAdminSettings: '/super-admin/settings',

  customerFeedback: '/customer/feedback',
  customerSubmitFeedback: '/customer/submit-feedback',
  customerFeedbackHistory: '/customer/feedback-history',
  customerSettings: '/customer/settings',
}
