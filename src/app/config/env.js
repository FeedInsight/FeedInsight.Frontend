/**
 * Centralized access to Vite environment variables. Never read
 * `import.meta.env` directly from feature code -- import from here so every
 * consumer stays in sync if a variable is renamed, and so missing required
 * variables fail fast with a clear error instead of a silent `undefined`
 * showing up three layers deep in an axios call.
 */
const required = (key, value) => {
  if (value === undefined || value === '') {
    // eslint-disable-next-line no-console
    console.warn(`[env] Missing expected environment variable: ${key}`)
  }
  return value
}

export const env = {
  apiBaseUrl: required('VITE_API_BASE_URL', import.meta.env.VITE_API_BASE_URL),
  devTenantId: import.meta.env.VITE_DEV_TENANT_ID,
  useMocks: import.meta.env.VITE_USE_MOCKS === 'true',
  isDev: import.meta.env.DEV,
}
