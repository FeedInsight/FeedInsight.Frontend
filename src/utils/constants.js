/**
 * src/utils/constants.js
 * ----------------------------------------------------------------------------
 * App-wide literal constants that must stay consistent across components,
 * mirrored from the backend enums/status columns described in the platform
 * README's SQL schema.
 * ----------------------------------------------------------------------------
 */
export const STORY_STATUS = {
  DRAFT: "Draft",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const SENTIMENT = {
  POSITIVE: "Positive",
  NEUTRAL: "Neutral",
  NEGATIVE: "Negative",
};

export const ADMIN_ROLES = {
  OWNER: "Owner",
  PRODUCT_MANAGER: "ProductManager",
  VIEWER: "Viewer",
};

export const CHAT_SENDER_ROLE = {
  USER: "user",
  ASSISTANT: "assistant",
};

export const ROUTES = {
  CUSTOMER_FEEDBACK: "/feedback",
  ADMIN_LOGIN: "/admin/login",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_BACKLOG: "/admin/backlog",
  ADMIN_CHAT: "/admin/assistant",
  ADMIN_SETTINGS: "/admin/settings",
};
