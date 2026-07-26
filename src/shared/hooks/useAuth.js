import { useAuthStore } from '@app/store/authStore.js'

/**
 * Thin convenience wrapper around authStore for components that only need
 * to read session state (never import the raw store from feature
 * components -- go through this hook so the storage implementation can
 * change later without touching every consumer).
 */
export function useAuth() {
  const { user, token, isAuthenticated, setSession, clearSession } = useAuthStore()
  return { user, token, isAuthenticated, setSession, clearSession }
}
