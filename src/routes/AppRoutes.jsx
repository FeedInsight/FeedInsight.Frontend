/**
 * src/routes/AppRoutes.jsx
 * ----------------------------------------------------------------------------
 * Single route table for the whole project (Customer Portal + Admin Portal
 * live in one React app, split purely by path prefix per the user's request
 * to keep this "one project not multiple projects").
 *
 * Structure:
 *   /                        -> redirect to /feedback (or a marketing page, TBD)
 *   /feedback                -> FeedbackSubmissionPage (public, no layout chrome)
 *   /admin/login              -> LoginPage (public)
 *   /admin/forgot-password    -> ForgotPasswordPage (public)
 *   /admin/*                  -> ProtectedRoute wraps AdminLayout, which
 *                                nests the real admin pages via <Outlet />
 *
 * ProtectedRoute (src/components/common/ProtectedRoute.jsx) reads
 * useAuth().isAuthenticated and redirects to ADMIN_LOGIN if false.
 * ----------------------------------------------------------------------------
 */
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PATHS from "./routePaths";

import ProtectedRoute from "../components/common/ProtectedRoute";
import AdminLayout from "../components/adminPortal/layout/AdminLayout";

import FeedbackSubmissionPage from "../pages/customer/FeedbackSubmissionPage";
import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import DashboardPage from "../pages/admin/DashboardPage";
import CategoriesPage from "../pages/admin/CategoriesPage";
import BacklogReviewPage from "../pages/admin/BacklogReviewPage";
import ChatAssistantPage from "../pages/admin/ChatAssistantPage";
import SettingsPage from "../pages/admin/SettingsPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={PATHS.CUSTOMER_FEEDBACK} replace />} />

      {/* Customer Portal — public */}
      <Route path={PATHS.CUSTOMER_FEEDBACK} element={<FeedbackSubmissionPage />} />

      {/* Admin auth — public */}
      <Route path={PATHS.ADMIN_LOGIN} element={<LoginPage />} />
      <Route path={PATHS.ADMIN_FORGOT_PASSWORD} element={<ForgotPasswordPage />} />

      {/* Admin Portal — protected */}
      <Route
        path={PATHS.ADMIN_ROOT}
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={PATHS.ADMIN_DASHBOARD} replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="backlog" element={<BacklogReviewPage />} />
        <Route path="backlog/:storyId" element={<BacklogReviewPage />} />
        <Route path="assistant" element={<ChatAssistantPage />} />
        <Route path="assistant/:sessionId" element={<ChatAssistantPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* TODO: add a NotFoundPage and a catch-all <Route path="*" .../> */}
    </Routes>
  );
}
