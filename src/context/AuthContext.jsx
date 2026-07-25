/**
 * src/context/AuthContext.jsx
 * ----------------------------------------------------------------------------
 * Owns the ADMIN PORTAL authenticated session only (JWT role-based auth per
 * README). Not used by the public Customer Portal.
 *
 * Provides via useAuth():
 *   - user: { id, fullName, email, role, tenantId } | null
 *   - isAuthenticated: boolean
 *   - isLoading: boolean   (true while rehydrating session on first load)
 *   - login(email, password): Promise
 *   - logout(): void
 *
 * Implementation notes:
 *   - On mount, if a token exists (src/utils/storage.getAuthToken), call
 *     authApi.fetchCurrentUser() to rehydrate `user`; on failure, clearAuth().
 *   - login() calls authApi.login(), stores token via setAuthToken(),
 *     stores tenantId via setTenantId(user.tenantId), then sets `user`.
 *   - logout() calls authApi.logout(), then clearAuth() and resets `user`.
 *   - This context does NOT hold Redux state on purpose — session identity is
 *     a cross-cutting concern read by both React Router guards and the
 *     Redux store's axios calls (via storage.js), not itself a domain slice.
 * ----------------------------------------------------------------------------
 */
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as authApi from "../api/authApi";
import { setAuthToken, setTenantId, clearAuth, getAuthToken } from "../utils/storage";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function rehydrate() {
      // TODO: guard with try/catch; on 401 clearAuth() and setUser(null)
      if (getAuthToken()) {
        const currentUser = await authApi.fetchCurrentUser();
        setUser(currentUser);
      }
      setIsLoading(false);
    }
    rehydrate();
  }, []);

  const login = useCallback(async (email, password) => {
    // TODO: handle field-level errors from authApi.login rejection
    const { token, user: loggedInUser } = await authApi.login({ email, password });
    setAuthToken(token);
    setTenantId(loggedInUser.tenantId);
    setUser(loggedInUser);
  }, []);

  const logout = useCallback(async () => {
    // TODO: swallow network errors on logout — always clear local state
    await authApi.logout();
    clearAuth();
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return ctx;
}
