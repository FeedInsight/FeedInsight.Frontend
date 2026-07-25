/**
 * src/config.js
 * ----------------------------------------------------------------------------
 * Single source of truth for environment-driven configuration. Every place in
 * the app that needs an env var reads it from here — never call
 * `process.env.REACT_APP_*` directly anywhere else, so all config stays
 * discoverable in one file.
 * ----------------------------------------------------------------------------
 */
const config = {
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api",
  defaultTenantPublicKey: process.env.REACT_APP_DEFAULT_TENANT_PUBLIC_KEY || "",
  features: {
    chatStreaming: process.env.REACT_APP_ENABLE_CHAT_STREAMING === "true",
    screenshotUpload: process.env.REACT_APP_ENABLE_SCREENSHOT_UPLOAD === "true",
  },
};

export default config;
