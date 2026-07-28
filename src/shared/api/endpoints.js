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
    submit: '/public/feedback', // POST multipart/form-data -> SubmitFeedbackCommand
  },

  // --- Auth (Admin Portal) ---
  auth: {
    login: '/Auth/login', // POST { email, password } -> { token, user }
    register: '/Auth/register',
    refresh: '/api/Auth/refresh', // POST -> RefreshTokenCommand
    logout: '/api/Auth/logout', // POST -> LogoutCommand
    registerAdmin: '/api/Auth/register-admin', // POST -> RegisterUserCommand
    me: '/api/Profile/me', // PUT -> UpdateProfileCommand (not GET)
  },

  // --- Dashboard / Analytics ---
  analytics: {
    dailySnapshots: '/analytics/daily-snapshots', // GET ?from=&to=
  },

  // --- Categories ---
  categories: {
    list: '/categories', // GET
    create: '/categories', // POST
    update: (id) => `/categories/${id}`, // PUT
    remove: (id) => `/categories/${id}`, // DELETE (soft delete)
  },

  // --- Backlog Review Workspace ---
  stories: {
    listDrafts: '/stories/draft', // GET -> GetDraftStoriesQuery
    detail: (id) => `/stories/${id}`, // GET
    approve: (id) => `/stories/${id}/approve`, // POST -> ApproveStoryCommandHandler
    reject: (id) => `/stories/${id}/reject`, // POST
    publishToJira: (id) => `/stories/${id}/publish`, // POST -> triggers Jira issue creation
    duplicates: (id) => `/stories/${id}/duplicates`, // GET -> Qdrant K-NN matches
  },

  // --- AI Product Assistant (Chat) ---
  chat: {
    sessions: '/chat/sessions', // GET (list), POST (create)
    sessionMessages: (sessionId) => `/chat/sessions/${sessionId}/messages`, // GET, POST -> SendAssistantMessageCommand
    clearSession: (sessionId) => `/chat/sessions/${sessionId}`, // DELETE -> ClearHistoryCommandHandler
  },

  // --- Tenant Settings (Jira connection) ---
  tenant: {
    settings: '/tenant/settings', // GET, PUT
    testJiraConnection: '/tenant/settings/jira/test', // POST
    regenerateWebhookSecret: '/tenant/settings/jira/webhook-secret', // POST
  },

  // --- Admin Users ---
  adminUsers: {
    list: '/admin-users', // GET
    invite: '/admin-users/invite', // POST
    updateRole: (id) => `/admin-users/${id}/role`, // PUT
    deactivate: (id) => `/admin-users/${id}/deactivate`, // POST
  },
}
