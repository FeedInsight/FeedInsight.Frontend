import { Menu, LogOut, Sparkles } from 'lucide-react'
import { ROLES } from '@app/config/constants.js'
import { useUiStore } from '@app/store/uiStore.js'
import { useAuth } from '@shared/hooks/useAuth.js'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@router/routes.js'

export default function AdminTopbar() {
  const { toggleSidebar, toggleChatDrawer } = useUiStore()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isProductOwner = user?.role === ROLES.PRODUCT_OWNER

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.login)
  }

  return (
    <header className="flex items-center justify-between border-b border-slate-200/80 bg-white px-4 py-2.5 shadow-2xs">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        {isProductOwner && (
          <>
            <button
              type="button"
              onClick={toggleChatDrawer}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:from-brand-500 hover:to-indigo-500 transition-all active:scale-95"
            >
              <Sparkles size={14} className="animate-pulse" />
              <span>AI Assistant</span>
            </button>

            <div className="h-4 w-px bg-slate-200" />
          </>
        )}

        <span className="text-xs font-semibold text-slate-700">{user?.firstName}</span>

        <button
          onClick={handleLogout}
          aria-label="Log out"
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={15} /> Logout
        </button>
      </div>
    </header>
  )
}
