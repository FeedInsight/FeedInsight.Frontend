export const ADMIN_ROLES = {
  OWNER: 'SuperAdmin',
  PRODUCT_MANAGER: 'ProductManager',
  VIEWER: 'Viewer',
}

export const STORY_STATUS = {
  DRAFT: 'Draft',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  PUBLISHED: 'Published',
}

export const SENTIMENT = {
  POSITIVE: 'Positive',
  NEUTRAL: 'Neutral',
  NEGATIVE: 'Negative',
}

export const CHAT_SENDER_ROLE = {
  USER: 'User',
  ASSISTANT: 'Assistant',
}

export const QUERY_KEYS = {
  categories: ['categories'],
  draftStories: ['stories', 'draft'],
  story: (id) => ['stories', id],
  dailySnapshots: (range) => ['analytics', 'daily-snapshots', range],
  chatSessions: ['chat', 'sessions'],
  chatMessages: (sessionId) => ['chat', 'sessions', sessionId, 'messages'],
  tenantSettings: ['tenant', 'settings'],
  apiSettings: ['api', 'settings'],
  adminUsers: ['admin-users'],
  tenantsLookup: ['tenants', 'lookup'],
}

export const HTTP_HEADERS = {
  TENANT_ID: 'X-Tenant-Id',
}
