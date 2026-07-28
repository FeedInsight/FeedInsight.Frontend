import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Tags, ListChecks, MessageSquare, Settings, Users, Plug, KeyRound } from 'lucide-react'
import { cn } from '@shared/utils/classNames.js'
import { useUiStore } from '@app/store/uiStore.js'

/**
 * Left navigation for the Admin Portal Control Center. Each entry maps 1:1
 * to a feature's top-level page route registered in router/routes.js.
 * Add a new entry here whenever a new admin feature page is added -- routes
 * that shouldn't appear in nav (e.g. StoryDetailPage) stay out of this list.
 */
const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/backlog', label: 'Backlog Review', icon: ListChecks },
  { to: '/admin/assistant', label: 'AI Assistant', icon: MessageSquare },
  { to: '/admin/users', label: 'Admin Users', icon: Users },
  { to: '/admin/settings', label: 'Tenant Settings', icon: Settings },
  { to: '/workspace/settings/integrations', label: 'Jira Integration', icon: Plug },
  { to: '/workspace/api-settings', label: 'API Settings', icon: KeyRound },
]

export default function AdminSidebar() {
  const { isSidebarCollapsed } = useUiStore()

  return (
    <aside
      className={cn(
        'flex flex-col gap-1 border-r border-slate-200 bg-white p-3 transition-all',
        isSidebarCollapsed ? 'w-16' : 'w-60',
      )}
    >
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100',
              isActive && 'bg-brand-50 text-brand-700',
            )
          }
        >
          <Icon size={18} />
          {!isSidebarCollapsed && <span>{label}</span>}
        </NavLink>
      ))}
    </aside>
  )
}
