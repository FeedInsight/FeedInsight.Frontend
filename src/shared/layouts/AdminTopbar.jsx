import { Menu, LogOut } from 'lucide-react'
import { useUiStore } from '@app/store/uiStore.js'
import { useAuth } from '@shared/hooks/useAuth.js'
import { useNavigate } from 'react-router-dom'

/**
 * Top bar shown on every Admin Portal screen: sidebar toggle, current
 * tenant/company name (read from the authenticated user), and logout.
 * Keep this component free of feature-specific actions -- per-page actions
 * (e.g. "New Category" button) belong inside that page's own header, not
 * here.
 */
export default function AdminTopbar() {
  const { toggleSidebar } = useUiStore()
  const { user, clearSession } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearSession()
    navigate('/login')
  }

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
      <button onClick={toggleSidebar} aria-label="Toggle sidebar" className="text-slate-500">
        <Menu size={20} />
      </button>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-600">{user?.fullName}</span>
        <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-slate-500 hover:text-red-600">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </header>
  )
}
