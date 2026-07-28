import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './routes.js'
import ProtectedRoute from './ProtectedRoute.jsx'
import { CAN_MANAGE_TENANT_SETTINGS } from '@shared/constants/roles.js'
import { CAN_MANAGE_ADMIN_USERS } from '@shared/constants/roles.js'

import CustomerLayout from '@shared/layouts/CustomerLayout.jsx'
import AuthLayout from '@shared/layouts/AuthLayout.jsx'
import AdminLayout from '@shared/layouts/AdminLayout.jsx'

import CustomerFeedbackPage from '@features/customerPortal/pages/CustomerFeedbackPage.jsx'
import LoginPage from '@features/auth/pages/LoginPage.jsx'
import RegisterPage from '@features/auth/pages/RegisterPage.jsx'
import DashboardPage from '@features/dashboard/pages/DashboardPage.jsx'
import CategoriesPage from '@features/categories/pages/CategoriesPage.jsx'
import BacklogReviewPage from '@features/backlog/pages/BacklogReviewPage.jsx'
import StoryDetailPage from '@features/backlog/pages/StoryDetailPage.jsx'
import AssistantPage from '@features/chat/pages/AssistantPage.jsx'
import AdminUsersPage from '@features/adminUsers/pages/AdminUsersPage.jsx'
import TenantSettingsPage from '@features/tenantSettings/pages/TenantSettingsPage.jsx'

/**
 * Single route table for the whole app. Both portals are registered in one
 * project as required, but stay visually and behaviorally separate through
 * their layouts: CustomerLayout (public) vs AdminLayout (behind
 * ProtectedRoute). Do not add feature pages outside their designated
 * layout branch below.
 *
 * When adding a new admin page:
 *   1. Add its path to router/routes.js
 *   2. Add the <Route> below, under the AdminLayout branch
 *   3. Add a nav entry in shared/layouts/AdminSidebar.jsx
 */
export default function AppRouter() {
  return (
    <Routes>
      {/* --- Customer Portal (public, tenant-scoped) --- */}
      <Route element={<CustomerLayout />}>
        <Route path={ROUTES.customerFeedback} element={<CustomerFeedbackPage />} />
        <Route path={ROUTES.customerFeedbackDefault} element={<CustomerFeedbackPage />} />
      </Route>

      {/* --- Auth --- */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.register} element={<RegisterPage />} />
      </Route>

      {/* --- Admin Portal (JWT-protected) --- */}
      <Route element={<ProtectedRoute />}>
      <Route element={<AdminLayout />}>
        <Route path={ROUTES.adminDashboard} element={<DashboardPage />} />
        <Route path={ROUTES.adminCategories} element={<CategoriesPage />} />
        <Route path={ROUTES.adminBacklog} element={<BacklogReviewPage />} />
        <Route path={ROUTES.adminStoryDetail} element={<StoryDetailPage />} />
        <Route path={ROUTES.adminAssistant} element={<AssistantPage />} />

        <Route element={<ProtectedRoute requiredRoles={CAN_MANAGE_ADMIN_USERS} />}>
        <Route path={ROUTES.adminUsers} element={<AdminUsersPage />} />
        </Route>

        <Route element={<ProtectedRoute requiredRoles={CAN_MANAGE_TENANT_SETTINGS} />}>
          <Route path={ROUTES.adminSettings} element={<TenantSettingsPage />} />
        </Route>
      </Route>
      </Route>

      <Route path="/" element={<Navigate to={ROUTES.adminDashboard} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.adminDashboard} replace />} />
    </Routes>
  )
}
