import { useAuthStore } from '@app/store/authStore.js'
import { useTenantStore } from '@app/store/tenantStore.js'
import { logout as apiLogout } from '@features/auth/api/authApi.js'

/**
 * Thin convenience wrapper around authStore for components that only need
 * to read session state (never import the raw store from feature
 * components -- go through this hook so the storage implementation can
 * change later without touching every consumer).
 */
export function useAuth() {
  const { user, token, refreshToken, isAuthenticated, setSession, clearSession } = useAuthStore()
  const clearTenant = useTenantStore((s) => s.clearTenant)

  const logout = async () => {
    try {
      await apiLogout({ refreshToken, token })
    } catch {
      // Ignore network errors
    } finally {
      clearSession()
      clearTenant()
    }
  }

  return { user, token, refreshToken, isAuthenticated, setSession, clearSession, logout }
}
