import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      setSession: (token, user, refreshToken = null) =>
        set({ token, refreshToken, user, isAuthenticated: true }),

      clearSession: () =>
        set({ token: null, refreshToken: null, user: null, isAuthenticated: false }),
    }),
    { name: 'feedinsight-auth' },
  ),
)
