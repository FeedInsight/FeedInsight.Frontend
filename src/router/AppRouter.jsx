import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './routes.js'
import ProtectedRoute from './ProtectedRoute.jsx'
import {
  REQUIRE_PRODUCT_OWNER,
  REQUIRE_SUPER_ADMIN,
} from '@shared/constants/roles.js'
import { useAuth } from '@shared/hooks/useAuth.js'
import { getDashboardRouteForRole } from '@shared/utils/roleUtils.js'

import AuthLayout from '@shared/layouts/AuthLayout.jsx'
import AdminLayout from '@shared/layouts/AdminLayout.jsx'

import LoginPage from '@features/auth/pages/LoginPage.jsx'
import RegisterPage from '@features/auth/pages/RegisterPage.jsx'
import DashboardPage from '@features/dashboard/pages/DashboardPage.jsx'
import TriageInboxPage from '@features/triage/pages/TriageInboxPage.jsx'
import CategoriesPage from '@features/categories/pages/CategoriesPage.jsx'
import BacklogReviewPage from '@features/backlog/pages/BacklogReviewPage.jsx'
import StoryDetailPage from '@features/backlog/pages/StoryDetailPage.jsx'
import AssistantPage from '@features/chat/pages/AssistantPage.jsx'
import AdminUsersPage from '@features/adminUsers/pages/AdminUsersPage.jsx'
import AddSuperAdminPage from '@features/adminUsers/pages/AddSuperAdminPage.jsx'
import SettingsPage from '@features/settings/pages/SettingsPage.jsx'
import JiraIntegrationPage from '@features/jira/pages/JiraIntegrationPage.jsx'
import TenantsDirectoryPage from '@features/tenantsDirectory/pages/TenantsDirectoryPage.jsx'
import ApiKeysPage from '@features/apiSettings/pages/ApiKeysPage.jsx'
import AddProductOwnerPage from '@features/settings/pages/AddProductOwnerPage.jsx'
import NotFoundPage from '@shared/pages/NotFoundPage.jsx'

function HomeRedirect() {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />
  }
  return <Navigate to={getDashboardRouteForRole(user?.role)} replace />
}

export default function AppRouter() {
  return (
    <Routes>
      {/* --- Auth --- */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.register} element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>

          <Route element={<ProtectedRoute requiredRoles={REQUIRE_PRODUCT_OWNER} />}>
            <Route path={ROUTES.workspaceDashboard} element={<DashboardPage />} />
            <Route path={ROUTES.workspaceTriage} element={<TriageInboxPage />} />
            <Route path={ROUTES.workspaceTriageDetail} element={<TriageInboxPage />} />
            <Route path={ROUTES.workspaceSettings} element={<SettingsPage />} />
            <Route path={ROUTES.workspaceJiraIntegration} element={<JiraIntegrationPage />} />
            <Route path={ROUTES.workspaceApiKeys} element={<ApiKeysPage />} />
            <Route path={ROUTES.workspaceAddProductOwner} element={<AddProductOwnerPage />} />
            <Route path={ROUTES.workspaceCategories} element={<CategoriesPage />} />
            <Route path={ROUTES.workspaceBacklog} element={<BacklogReviewPage />} />
            <Route path={ROUTES.workspaceStoryDetail} element={<StoryDetailPage />} />
            <Route path={ROUTES.workspaceAssistant} element={<AssistantPage />} />
          </Route>

          <Route element={<ProtectedRoute requiredRoles={REQUIRE_SUPER_ADMIN} />}>
            <Route path={ROUTES.superAdminTenants} element={<TenantsDirectoryPage />} />
            <Route path={ROUTES.superAdminUsers} element={<AdminUsersPage />} />
            <Route path={ROUTES.superAdminAddAdmin} element={<AddSuperAdminPage />} />
            <Route path={ROUTES.superAdminSettings} element={<SettingsPage />} />
          </Route>

        </Route>
      </Route>

      <Route path={ROUTES.notFound} element={<NotFoundPage />} />
      <Route path="/" element={<HomeRedirect />} />
      <Route path="*" element={<Navigate to={ROUTES.notFound} replace />} />
    </Routes>
  )
}
