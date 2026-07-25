/**
 * src/components/common/ProtectedRoute.jsx
 * ----------------------------------------------------------------------------
 * Route guard used only by the /admin/* subtree in AppRoutes.jsx.
 *
 * Behavior:
 *   - While useAuth().isLoading -> render a full-page <Loader />.
 *   - If !isAuthenticated -> <Navigate to={PATHS.ADMIN_LOGIN} replace />,
 *     preserving the attempted location in state so LoginPage can redirect
 *     back after a successful login (TODO: implement that redirect-back).
 *   - Else -> render children.
 * ----------------------------------------------------------------------------
 */
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import PATHS from "../../routes/routePaths";
import Loader from "./Loader/Loader";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader fullPage label="Checking your session…" />;
  }

  if (!isAuthenticated) {
    return <Navigate to={PATHS.ADMIN_LOGIN} replace state={{ from: location }} />;
  }

  return children;
}
