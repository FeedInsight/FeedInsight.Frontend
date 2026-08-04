import { Outlet, useLocation } from 'react-router-dom'
import AdminSidebar from './AdminSidebar.jsx'
import AdminTopbar from './AdminTopbar.jsx'
import ChatDrawer from '@features/chat/components/ChatDrawer.jsx'
import ErrorBoundary from '@shared/components/ErrorBoundary.jsx'

/**
 * Shell for every authenticated Admin Portal screen (README §Admin Portal /
 * Control Center): fixed sidebar + topbar, routed content in between.
 * Mounted behind ProtectedRoute in router/AppRouter.jsx -- never render this
 * layout directly without that guard.
 */
export default function AdminLayout() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
          <ErrorBoundary key={location.pathname}>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
      <ChatDrawer />
    </div>
  )
}
