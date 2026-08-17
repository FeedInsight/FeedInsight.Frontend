export const ROLES = {
  SUPER_ADMIN: 'SuperAdmin',
  PRODUCT_OWNER: 'ProductOwner',
  COMPANY_CUSTOMER: 'CompanyCustomer',
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
  feedbacks: ['feedbacks'],
  feedbackDetail: (id) => ['feedbacks', id],
  customerFeedbackHistory: ['customer-feedback-history'],
  categories: ['categories'],
  draftStories: ['stories', 'draft'],
  userStories: ['stories', 'user-stories'],
  story: (id) => ['stories', id],
  latestAnalyticsSnapshot: ['analytics', 'latest-snapshot'],
  analyticsSnapshots: (range) => ['analytics', 'snapshots', range],
  chatSessions: ['chat', 'sessions'],
  chatMessages: (sessionId) => ['chat', 'sessions', sessionId, 'messages'],
  tenantSettings: ['tenant', 'settings'],
  apiKeys: ['api', 'keys'],
  adminUsers: ['admin-users'],
  tenantsLookup: ['tenants', 'lookup'],
  customers: (params) => (params ? ['customers', params] : ['customers']),
  customerDetail: (id) => ['customers', id],
  developmentCustomerFeedbacks: (params) =>
    params ? ['development-feedbacks', 'customer', params] : ['development-feedbacks', 'customer'],
  developmentCompanyFeedbacks: (params) =>
    params ? ['development-feedbacks', 'company', params] : ['development-feedbacks', 'company'],
}

export const HTTP_HEADERS = {
  API_KEY: 'X-Api-Key',
  TENANT_ID: 'X-Tenant-Id',
}
