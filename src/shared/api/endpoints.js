export const ENDPOINTS = {
  // --- Public Ingestion / Customer Portal ---
  feedback: {
    submit: '/Ingestion/feedback', // POST multipart/form-data -> SubmitFeedbackCommand
    list: '/feedbacks', // GET feedback list
    detail: (id) => `/feedbacks/${id}`,
  },

  customerFeedback: {
    submit: '/customer/feedback', // POST submit new feedback ticket
    history: '/customer/feedback', // GET all feedback submitted by authenticated user
  },

  // --- Auth (Admin Portal) ---
  auth: {
    login: '/Auth/login', // POST { email, password }
    register: '/Auth/register', // POST { name, email, password }
    refresh: '/Auth/refresh', // POST
    logout: '/Auth/logout', // POST
    registerAdmin: '/Auth/register-admin', // POST
    me: '/Profile/me',
    mePassword: '/Profile/me/password',
  },

  // --- Profile ---
  profile: {
    update: '/Profile/me', // PUT
    updatePassword: '/Profile/me/password', // PUT
  },

  // --- Dashboard / Analytics ---
  analytics: {
    latestSnapshot: '/Analytics/snapshots/latest',
    snapshots: '/Analytics/snapshots',
  },

  // --- Categories ---
  categories: {
    list: '/Categories', // GET
    create: '/Categories', // POST
    update: '/Categories', // PUT
    remove: (id) => `/Categories/${id}`, // DELETE
  },

  // --- Backlog Review Workspace ---
  stories: {
    listUserStories: '/user-stories', // GET
    detail: (id) => `/api/user-stories/${id}`, // GET
    update: (id) => `/user-stories/${id}`, // PUT
    syncToJira: (id) => `/user-stories/${id}/sync-to-jira`, // POST
    approve: (id) => `/stories/${id}/approve`, // POST
    reject: (id) => `/stories/${id}/reject`, // POST
    publishToJira: (id) => `/stories/${id}/publish`, // POST
    duplicates: (id) => `/stories/${id}/duplicates`, // GET
  },

  // --- AI Product Assistant (Chat) ---
  chat: {
    sessions: '/ChatSessions', // GET, POST
    sessionDetail: (sessionId) => `/ChatSessions/${sessionId}`, // GET, PATCH, DELETE
    sessionMessages: (sessionId) => `/ChatSessions/${sessionId}/messages`, // GET, POST
  },

  // --- Tenant Settings & Management ---
  tenant: {
    updateMyCompany: '/Tenants/my-company', // PUT
    configureJiraIntegration: '/Tenants/my-company/jira-config', // PUT
    addOwner: '/Tenants/my-company/owners', // POST
    lookup: '/Tenants/lookup', // GET
    updateStatus: (id) => `/Tenants/${id}/status`, // PATCH
    testJiraCreate: (tenantId) => `/TestJira/${tenantId}/create`, // POST
    testJiraUpdate: (tenantId, issueKey) => `/TestJira/${tenantId}/update/${issueKey}`, // PUT
    jiraWebhook: (tenantId) => `/webhooks/jira/${tenantId}`, // POST
    testJiraConnection: '/Tenants/my-company/jira-config/test',
    regenerateWebhookSecret: '/Tenants/my-company/jira-config/webhook-secret',
    settings: '/Tenants/my-company',
    jiraConfig: '/Tenants/jira',
  },
  tenants: {
    updateMyCompany: '/Tenants/my-company',
    configureJiraIntegration: '/Tenants/my-company/jira-config',
    addOwner: '/Tenants/my-company/owners',
    lookup: '/Tenants/lookup',
    updateStatus: (id) => `/Tenants/${id}/status`,
    testJiraCreate: (tenantId) => `/TestJira/${tenantId}/create`,
    testJiraUpdate: (tenantId, issueKey) => `/TestJira/${tenantId}/update/${issueKey}`,
    jiraWebhook: (tenantId) => `/webhooks/jira/${tenantId}`,
    testJiraConnection: '/Tenants/my-company/jira-config/test',
    regenerateWebhookSecret: '/Tenants/my-company/jira-config/webhook-secret',
    settings: '/Tenants/my-company',
  },

  // --- Tenant API Keys ---
  apiKeys: {
    list: '/Tenants/my-company/api-keys', // GET
    create: '/Tenants/my-company/api-keys', // POST
    revoke: (id) => `/Tenants/my-company/api-keys/${id}`, // DELETE
  },

  // --- Users ---
  users: {
    productOwners: '/Users/product-owners', // GET
    lock: (id) => `/Users/${id}/lock`, // POST
    unlock: (id) => `/Users/${id}/unlock`, // POST
  },

  // --- Admin Users (Legacy alias mapping) ---
  adminUsers: {
    list: '/admin-users',
    invite: '/admin-users/invite',
    updateRole: (id) => `/admin-users/${id}/role`,
    deactivate: (id) => `/admin-users/${id}/deactivate`,
  },

  // --- Test & Search ---
  testSearch: {
    search: '/TestSearch/search', // GET
  },

  // --- Customers (Company Customers for Development Tenants) ---
  customers: {
    list: '/Customers/company-customers', // GET ?Page=&PageSize=
    create: '/Customers/company-customers', // POST { firstName, lastName, email, password }
    getById: (id) => `/Customers/company-customers/${id}`, // GET
    remove: (id) => `/Customers/${id}`, // DELETE
    lock: (id) => `/Customers/company-customers/${id}/lock`, // POST { reason?: string }
    unlock: (id) => `/Customers/company-customers/${id}/unlock`, // POST
  },

  // --- Development Feedback & Comments ---
  developmentFeedback: {
    customerSubmit: '/feedbacks/development/customer', // POST { rawContent, metadataJson }
    customerList: '/feedbacks/development/customer', // GET ?Page=&PageSize=
    companyList: '/feedbacks/development/company', // GET ?Page=&PageSize=
    addCompanyComment: (feedbackId) => `/feedbacks/development/company/${feedbackId}/comments`, // POST { content }
  },
}
