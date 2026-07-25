/**
 * src/api/endpoints.js
 * ----------------------------------------------------------------------------
 * Flat map of every backend route this frontend calls, so URLs are defined
 * ONCE and every *Api.js file references a constant instead of a hardcoded
 * string. Keep this in sync with FeedInsight.WebApi/Controllers.
 *
 * Placeholders like :id are replaced by the calling Api file, e.g.:
 *   ENDPOINTS.STORIES.BY_ID(storyId)
 * ----------------------------------------------------------------------------
 */
const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    FORGOT_PASSWORD: "/auth/forgot-password",
  },
  TENANT: {
    RESOLVE_BY_KEY: (publicKey) => `/tenants/resolve/${publicKey}`,
    SETTINGS: "/tenants/settings", // Jira base URL, webhook secret (write-only), etc.
  },
  FEEDBACK: {
    SUBMIT: "/feedback", // POST multipart/form-data (Customer Portal, public)
    LIST: "/feedback", // GET (Admin Portal, paginated, filterable by sentiment/status)
    BY_ID: (id) => `/feedback/${id}`,
  },
  CATEGORIES: {
    LIST: "/categories",
    CREATE: "/categories",
    UPDATE: (id) => `/categories/${id}`,
    DELETE: (id) => `/categories/${id}`,
  },
  STORIES: {
    LIST: "/stories", // GET draft/approved/rejected, paginated, filter by CategoryId/Status
    BY_ID: (id) => `/stories/${id}`,
    APPROVE: (id) => `/stories/${id}/approve`, // triggers Jira publish
    REJECT: (id) => `/stories/${id}/reject`,
    UPDATE_CRITERIA: (id) => `/stories/${id}/acceptance-criteria`,
    DUPLICATES: (id) => `/stories/${id}/duplicates`, // Qdrant similarity matches
  },
  ANALYTICS: {
    DASHBOARD_SNAPSHOT: "/analytics/dashboard", // latest DailyAnalyticsSnapshots row
    SENTIMENT_TRENDS: "/analytics/sentiment-trends", // time series for chart
    KPIS: "/analytics/kpis",
  },
  CHAT: {
    SESSIONS: "/chat/sessions",
    SESSION_BY_ID: (id) => `/chat/sessions/${id}`,
    MESSAGES: (sessionId) => `/chat/sessions/${sessionId}/messages`,
    SEND_MESSAGE: (sessionId) => `/chat/sessions/${sessionId}/messages`, // POST
    CLEAR_HISTORY: (sessionId) => `/chat/sessions/${sessionId}/clear`,
  },
};

export default ENDPOINTS;
