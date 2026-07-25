/**
 * src/routes/routePaths.js
 * ----------------------------------------------------------------------------
 * Central path constants for React Router — import these instead of typing
 * path strings in <Link>/<Route>/navigate() calls, so a path never drifts
 * out of sync between the route table and the components that link to it.
 * Mirrors src/utils/constants.js ROUTES but kept separate: ROUTES there is
 * for cross-cutting reads (e.g. axios redirect-on-401 logic outside React
 * Router context); this file is the actual Router path table.
 * ----------------------------------------------------------------------------
 */
const PATHS = {
  CUSTOMER_FEEDBACK: "/feedback",

  ADMIN_LOGIN: "/admin/login",
  ADMIN_FORGOT_PASSWORD: "/admin/forgot-password",

  ADMIN_ROOT: "/admin",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_BACKLOG: "/admin/backlog",
  ADMIN_BACKLOG_STORY: (id = ":storyId") => `/admin/backlog/${id}`,
  ADMIN_CHAT: "/admin/assistant",
  ADMIN_CHAT_SESSION: (id = ":sessionId") => `/admin/assistant/${id}`,
  ADMIN_SETTINGS: "/admin/settings",
};

export default PATHS;
