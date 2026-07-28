/**
 * App-wide constants that are NOT environment-specific. Anything tenant- or
 * deployment-specific belongs in env.js instead.
 */

// Matches AdminUsers.Role in the SQL schema. Keep these string values in
// exact sync with the backend enum/check-constraint.
export const ADMIN_ROLES = {
  OWNER: 'SuperAdmin',
  PRODUCT_MANAGER: 'ProductManager',
  VIEWER: 'Viewer',
}

// Matches UserStories.Status lifecycle used across BacklogReviewPage and
// StoryDetailPage.
export const STORY_STATUS = {
  DRAFT: 'Draft',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  PUBLISHED: 'Published', // set once JiraTicketKey is populated
}

// Matches CustomerFeedbacks.OverallSentiment, produced by the Router Agent.
export const SENTIMENT = {
  POSITIVE: 'Positive',
  NEUTRAL: 'Neutral',
  NEGATIVE: 'Negative',
}

export const CHAT_SENDER_ROLE = {
  USER: 'User',
  ASSISTANT: 'Assistant',
}

// React Query cache keys, grouped by feature so invalidation calls
// (queryClient.invalidateQueries) stay predictable across the app.
export const QUERY_KEYS = {
  categories: ['categories'],
  draftStories: ['stories', 'draft'],
  story: (id) => ['stories', id],
  dailySnapshots: (range) => ['analytics', 'daily-snapshots', range],
  chatSessions: ['chat', 'sessions'],
  chatMessages: (sessionId) => ['chat', 'sessions', sessionId, 'messages'],
  tenantSettings: ['tenant', 'settings'],
  adminUsers: ['admin-users'],
  tenantsLookup: ['tenants', 'lookup'],
}

export const HTTP_HEADERS = {
  TENANT_ID: 'X-Tenant-Id',
}
