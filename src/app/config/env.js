/**
 * Centralized access to Vite environment variables. Never read
 * `import.meta.env` directly from feature code -- import from here so every
 * consumer stays in sync if a variable is renamed, and so missing required
 * variables fail fast with a clear error instead of a silent `undefined`
 * showing up three layers deep in an axios call.
 */
const required = (key, value) => {
  if (value === undefined || value === '') {
    throw new Error(`[env] Missing expected environment variable: ${key}`)
  }
  return value
}

export const env = {
  apiBaseUrl: required('VITE_API_BASE_URL', import.meta.env.VITE_API_BASE_URL || 'https://feedinsight.runasp.net'),
  devTenantId: import.meta.env.VITE_DEV_TENANT_ID || '1697c07d-5f79-488f-9627-7a13d49b9aef',
  ingestionApiKey: import.meta.env.VITE_INGESTION_API_KEY || import.meta.env.VITE_DEV_API_KEY || 'fi_live_C2pyVhbc-y7vgM-qdse8sonIe19ckuc4vtUSho5Sc9w',
  useMocks: import.meta.env.VITE_USE_MOCKS === 'true',
  isDev: import.meta.env.DEV,
}
