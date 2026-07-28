/**
 * Single source of truth for every backend route this frontend calls.
 * Feature `api/*.js` files MUST import paths from here instead of hardcoding
 * strings, so a backend route rename touches exactly one file.
 *
 * Paths are relative to env.apiBaseUrl (see app/config/env.js) and grouped
 * to match FeedInsight.WebApi/Controllers and the Features/ CQRS slices
 * described in the README's directory structure.
 */
export const ENDPOINTS = {
  // --- Public / Customer Portal (no auth, requires X-Tenant-Id) ---
  feedback: {
    submit: '/api/Ingestion/feedback', // POST -> SubmitFeedbackCommand
  },

  // --- Auth (Admin Portal) ---
  auth: {
    login: '/Auth/login', // POST { email, password } -> { token, user }
    register: '/Auth/register',
    me: '/Auth/me', // GET current session user
  },

  // --- Dashboard / Analytics ---
  analytics: {
    dailySnapshots: '/analytics/daily-snapshots', // TODO: not in current API spec
  },

  // --- Categories ---
  categories: {
    list: '/api/Categories', // TODO: not in current API spec
    create: '/api/Categories', // TODO: not in current API spec
    update: (id) => `/api/Categories/${id}`, // TODO: not in current API spec
    remove: (id) => `/api/Categories/${id}`, // TODO: not in current API spec
  },

  // --- Backlog Review Workspace ---
  stories: {
    listDrafts: '/api/Stories/draft', // TODO: not in current API spec
    detail: (id) => `/api/Stories/${id}`, // TODO: not in current API spec
    approve: (id) => `/api/Stories/${id}/approve`, // TODO: not in current API spec
    reject: (id) => `/api/Stories/${id}/reject`, // TODO: not in current API spec
    publishToJira: (id) => `/api/Stories/${id}/publish`, // TODO: not in current API spec
    duplicates: (id) => `/api/Stories/${id}/duplicates`, // TODO: not in current API spec
  },

  // --- AI Product Assistant (Chat) ---
  chat: {
    sessions: '/api/Chat/sessions', // TODO: not in current API spec
    sessionMessages: (sessionId) => `/api/Chat/sessions/${sessionId}/messages`, // TODO: not in current API spec
    clearSession: (sessionId) => `/api/Chat/sessions/${sessionId}`, // TODO: not in current API spec
  },

  // --- Tenant Settings (Jira connection) ---
  tenant: {
    settings: '/api/Tenants/my-company', // PUT -> UpdateTenantCommand
    testJiraConnection: '/api/Tenants/my-company/jira-config', // TODO: not in current API spec
    regenerateWebhookSecret: '/api/Tenants/my-company/jira-config', // TODO: not in current API spec
    configureJiraIntegration: '/api/Tenants/my-company/jira-config', // POST -> TODO: not in current API spec
  },

  apiSettings: {
    ingestionKeys: '/api/Tenants/my-company/api-keys', // GET
  },

  // --- Admin Users ---
  adminUsers: {
    list: '/api/Users/product-owners', // GET
    invite: '/api/Tenants/my-company/owners', // POST -> CreateTenantOwnerCommand
    updateRole: (id) => `/api/Users/${id}/role`, // TODO: not in current API spec
    deactivate: (id) => `/api/Users/${id}/lock`, // POST -> LockUserRequest
  },
}
