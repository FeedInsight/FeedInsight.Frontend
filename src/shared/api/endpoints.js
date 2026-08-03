export const ENDPOINTS = {
  // --- Public Ingestion / Customer Portal ---
  feedback: {
    submit: '/api/Ingestion/feedback', // POST multipart/form-data -> SubmitFeedbackCommand
    list: '/api/feedbacks', // GET feedback list
    detail: (id) => `/api/feedbacks/${id}`,
  },

  // --- Auth (Admin Portal) ---
  auth: {
    login: '/api/Auth/login', // POST { email, password }
    register: '/api/Auth/register', // POST { name, email, password }
    refresh: '/api/Auth/refresh', // POST
    logout: '/api/Auth/logout', // POST
    registerAdmin: '/api/Auth/register-admin', // POST
    me: '/api/Profile/me',
    mePassword: '/api/Profile/me/password',
  },

  // --- Profile ---
  profile: {
    update: '/api/Profile/me', // PUT
    updatePassword: '/api/Profile/me/password', // PUT
  },

  // --- Dashboard / Analytics ---
  analytics: {
    dailySnapshots: '/api/analytics/daily-snapshots', // GET ?from=&to=
  },

  // --- Categories ---
  categories: {
    list: '/api/Categories', // GET
    create: '/api/Categories', // POST
    update: '/api/Categories', // PUT
    remove: (id) => `/api/Categories/${id}`, // DELETE
  },

  // --- Backlog Review Workspace ---
  stories: {
    listDrafts: '/api/stories/draft', // GET
    detail: (id) => `/api/stories/${id}`, // GET
    approve: (id) => `/api/stories/${id}/approve`, // POST
    reject: (id) => `/api/stories/${id}/reject`, // POST
    publishToJira: (id) => `/api/stories/${id}/publish`, // POST
    duplicates: (id) => `/api/stories/${id}/duplicates`, // GET
  },

  // --- AI Product Assistant (Chat) ---
  chat: {
    sessions: '/api/ChatSessions', // GET, POST
    sessionDetail: (sessionId) => `/api/ChatSessions/${sessionId}`, // GET, PATCH, DELETE
    sessionMessages: (sessionId) => `/api/ChatSessions/${sessionId}/messages`, // GET, POST
  },

  // --- Tenant Settings & Management ---
  tenant: {
    updateMyCompany: '/api/Tenants/my-company', // PUT
    configureJiraIntegration: '/api/Tenants/my-company/jira-config', // PUT
    addOwner: '/api/Tenants/my-company/owners', // POST
    lookup: '/api/Tenants/lookup', // GET
    updateStatus: (id) => `/api/Tenants/${id}/status`, // PATCH
    testJiraCreate: (tenantId) => `/api/TestJira/${tenantId}/create`, // POST
    testJiraUpdate: (tenantId, issueKey) => `/api/TestJira/${tenantId}/update/${issueKey}`, // PUT
    jiraWebhook: (tenantId) => `/api/webhooks/jira/${tenantId}`, // POST
    testJiraConnection: '/api/Tenants/my-company/jira-config/test',
    regenerateWebhookSecret: '/api/Tenants/my-company/jira-config/webhook-secret',
    settings: '/api/Tenants/my-company',
  },
  tenants: {
    updateMyCompany: '/api/Tenants/my-company',
    configureJiraIntegration: '/api/Tenants/my-company/jira-config',
    addOwner: '/api/Tenants/my-company/owners',
    lookup: '/api/Tenants/lookup',
    updateStatus: (id) => `/api/Tenants/${id}/status`,
    testJiraCreate: (tenantId) => `/api/TestJira/${tenantId}/create`,
    testJiraUpdate: (tenantId, issueKey) => `/api/TestJira/${tenantId}/update/${issueKey}`,
    jiraWebhook: (tenantId) => `/api/webhooks/jira/${tenantId}`,
    testJiraConnection: '/api/Tenants/my-company/jira-config/test',
    regenerateWebhookSecret: '/api/Tenants/my-company/jira-config/webhook-secret',
    settings: '/api/Tenants/my-company',
  },

  // --- Tenant API Keys ---
  apiKeys: {
    list: '/api/Tenants/my-company/api-keys', // GET
    create: '/api/Tenants/my-company/api-keys', // POST
    revoke: (id) => `/api/Tenants/my-company/api-keys/${id}`, // DELETE
  },

  // --- Users ---
  users: {
    productOwners: '/api/Users/product-owners', // GET
    lock: (id) => `/api/Users/${id}/lock`, // POST
    unlock: (id) => `/api/Users/${id}/unlock`, // POST
  },

  // --- Admin Users (Legacy alias mapping) ---
  adminUsers: {
    list: '/api/admin-users',
    invite: '/api/admin-users/invite',
    updateRole: (id) => `/api/admin-users/${id}/role`,
    deactivate: (id) => `/api/admin-users/${id}/deactivate`,
  },

  // --- Test & Search ---
  testSearch: {
    search: '/api/TestSearch/search', // GET
  },
}
