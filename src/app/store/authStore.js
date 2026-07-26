import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Admin Portal auth session (JWT role-based auth per README §Admin Portal).
 * Holds ONLY client-side session state -- never business/domain data.
 *
 * Shape of `user` should mirror the AdminUsers table fields the JWT claims
 * expose: { id, tenantId, fullName, email, role }. `role` must be one of
 * ADMIN_ROLES from app/config/constants.js and is what ProtectedRoute and
 * role-gated UI (e.g. hiding TenantSettings from Viewer role) check against.
 *
 * Persisted to localStorage under the "feedinsight-auth" key so a page
 * refresh doesn't log the admin out; the token itself is still validated
 * server-side on every request via the axios interceptor.
 */
export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null, // { id, tenantId, fullName, email, role }
      isAuthenticated: false,

      setSession: (token, user) => set({ token, user, isAuthenticated: true }),

      clearSession: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    { name: 'feedinsight-auth' },
  ),
)
