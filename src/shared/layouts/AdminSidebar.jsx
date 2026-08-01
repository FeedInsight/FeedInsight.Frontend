import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Tags,
  ListChecks,
  MessageSquare,
  Settings,
  Users,
  Plug,
  KeyRound,
  Building,
} from 'lucide-react'
import { cn } from '@shared/utils/classNames.js'
import { useUiStore } from '@app/store/uiStore.js'
import { useAuth } from '@shared/hooks/useAuth.js'
import {
  CAN_MANAGE_ADMIN_USERS,
  CAN_VIEW_ALL_TENANTS,
  CAN_MANAGE_TENANT_SETTINGS,
} from '@shared/constants/roles.js'
import { ROUTES } from '@router/routes.js'
import FeedInsightLogo from '@shared/components/ui/FeedInsightLogo'
import FeedInsightLogoText from '@shared/components/ui/FeedInsightLogoText'

const NAV_ITEMS = [
  { to: ROUTES.adminDashboard, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.adminCategories, label: 'Categories', icon: Tags },
  { to: ROUTES.adminBacklog, label: 'Backlog Review', icon: ListChecks },
  { to: ROUTES.adminAssistant, label: 'AI Assistant', icon: MessageSquare },
  { to: ROUTES.adminUsers, label: 'Admin Users', icon: Users, roles: CAN_MANAGE_ADMIN_USERS },
  {
    to: ROUTES.tenantsDirectory,
    label: 'Tenants Directory',
    icon: Building,
    roles: CAN_VIEW_ALL_TENANTS,
  },
  {
    to: ROUTES.adminSettings,
    label: 'Tenant Settings',
    icon: Settings,
    roles: CAN_MANAGE_TENANT_SETTINGS,
  },
  {
    to: ROUTES.jiraIntegrationSettings,
    label: 'Jira Integration',
    icon: Plug,
    roles: CAN_MANAGE_TENANT_SETTINGS,
  },
  {
    to: ROUTES.apiSettings,
    label: 'API Settings',
    icon: KeyRound,
    roles: CAN_MANAGE_TENANT_SETTINGS,
  },
]

export default function AdminSidebar() {
  const { isSidebarCollapsed } = useUiStore()
  const { user } = useAuth()

  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (!item.roles) return true
    return item.roles.includes(user?.role)
  })

  return (
    <aside
      className={cn(
        'flex flex-col gap-1 border-r border-slate-200 bg-white p-3 transition-all',
        isSidebarCollapsed ? 'w-16' : 'w-60',
      )}
    >
      <div className="flex justify-center mb-2">
        {isSidebarCollapsed ? <FeedInsightLogo size={42} /> : <FeedInsightLogoText />}
      </div>

      {visibleNavItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-100',
              isActive ? 'bg-brand-50 text-brand-500 font-bold' : 'text-slate-600 font-medium',
            )
          }
        >
          <Icon size={18} className="shrink-0" />
          {!isSidebarCollapsed && <span className="truncate">{label}</span>}
        </NavLink>
      ))}
    </aside>
  )
}
