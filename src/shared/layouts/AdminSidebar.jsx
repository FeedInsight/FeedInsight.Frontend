import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Inbox,
  Tags,
  ListChecks,
  MessageSquare,
  MessageSquarePlus,
  MessagesSquare,
  Settings,
  Users,
  UserPlus,
  Plug,
  KeyRound,
  Building,
} from 'lucide-react'
import { cn } from '@shared/utils/classNames.js'
import { useUiStore } from '@app/store/uiStore.js'
import { useAuth } from '@shared/hooks/useAuth.js'
import {
  REQUIRE_COMPANY_CUSTOMER,
  REQUIRE_PRODUCT_OWNER,
  REQUIRE_SUPER_ADMIN,
} from '@shared/constants/roles.js'
import { ROUTES } from '@router/routes.js'
import FeedInsightLogo from '@shared/components/ui/FeedInsightLogo'
import FeedInsightLogoText from '@shared/components/ui/FeedInsightLogoText'
import { canAccessApiKeys, canAccessCustomers, isCompanyCustomer } from '@shared/utils/roleUtils.js'
import {
  useDevelopmentCustomerFeedbacks,
  useDevelopmentCompanyFeedbacks,
} from '@features/customerFeedback/hooks/useCustomerFeedback.js'
import { useUnseenResponses } from '@features/customerFeedback/hooks/useUnseenResponses.js'
import { usePOUnseenCompanyFeedbacks } from '@features/customerFeedback/hooks/usePOUnseenCompanyFeedbacks.js'
import { useFeedbacks } from '@features/triage/hooks/useFeedbacks.js'
import { useUnseenTriageFeedbacks } from '@features/triage/hooks/useUnseenTriageFeedbacks.js'
import { normalizeFeedbackList } from '@features/customerFeedback/utils/feedbackNormalizer.js'
import { useMemo } from 'react'

const NAV_ITEMS = [
  { to: ROUTES.workspaceDashboard, label: 'Dashboard', icon: LayoutDashboard, roles: REQUIRE_PRODUCT_OWNER },
  { to: ROUTES.workspaceTriage, label: 'Triage Inbox', icon: Inbox, roles: REQUIRE_PRODUCT_OWNER },
  {
    to: ROUTES.workspaceCustomerFeedbacks,
    label: 'Customer Feedbacks',
    icon: MessagesSquare,
    roles: REQUIRE_PRODUCT_OWNER,
  },
  { to: ROUTES.workspaceCategories, label: 'Categories', icon: Tags, roles: REQUIRE_PRODUCT_OWNER },
  { to: ROUTES.workspaceBacklog, label: 'Backlog Review', icon: ListChecks, roles: REQUIRE_PRODUCT_OWNER },
  { to: ROUTES.workspaceAssistant, label: 'AI Assistant', icon: MessageSquare, roles: REQUIRE_PRODUCT_OWNER },
  {
    to: ROUTES.workspaceCustomers,
    label: 'Customers',
    icon: Users,
    roles: REQUIRE_PRODUCT_OWNER,
  },
  {
    to: ROUTES.workspaceSettings,
    label: 'Settings',
    icon: Settings,
    roles: REQUIRE_PRODUCT_OWNER,
  },
  {
    to: ROUTES.workspaceJiraIntegration,
    label: 'Jira Integration',
    icon: Plug,
    roles: REQUIRE_PRODUCT_OWNER,
  },
  {
    to: ROUTES.workspaceApiKeys,
    label: 'API Keys',
    icon: KeyRound,
    roles: REQUIRE_PRODUCT_OWNER,
  },
  {
    to: ROUTES.workspaceAddProductOwner,
    label: 'Add Product Owner',
    icon: UserPlus,
    roles: REQUIRE_PRODUCT_OWNER,
  },
  {
    to: ROUTES.superAdminTenants,
    label: 'Tenants Directory',
    icon: Building,
    roles: REQUIRE_SUPER_ADMIN,
  },
  {
    to: ROUTES.superAdminUsers,
    label: 'Product Owners',
    icon: Users,
    roles: REQUIRE_SUPER_ADMIN,
  },
  {
    to: ROUTES.superAdminAddAdmin,
    label: 'Add Super Admin',
    icon: UserPlus,
    roles: REQUIRE_SUPER_ADMIN,
  },
  {
    to: ROUTES.superAdminSettings,
    label: 'Settings',
    icon: Settings,
    roles: REQUIRE_SUPER_ADMIN,
  },
  {
    to: ROUTES.customerSubmitFeedback,
    label: 'Submit Feedback',
    icon: MessageSquarePlus,
    roles: REQUIRE_COMPANY_CUSTOMER,
  },
  {
    to: ROUTES.customerFeedback,
    label: 'My Feedbacks',
    icon: MessagesSquare,
    roles: REQUIRE_COMPANY_CUSTOMER,
  },
  {
    to: ROUTES.customerSettings,
    label: 'Settings',
    icon: Settings,
    roles: REQUIRE_COMPANY_CUSTOMER,
  },
]

export default function AdminSidebar() {
  const { isSidebarCollapsed } = useUiStore()
  const { user } = useAuth()
  const isCustomer = isCompanyCustomer(user?.role)
  const isPO = !isCustomer && (user?.role === 'ProductOwner' || String(user?.role || '').toLowerCase() === 'productowner')

  // 1. Customer portal unseen responses
  const { data: customerFeedbackData } = useDevelopmentCustomerFeedbacks(
    isCustomer ? { page: 1, pageSize: 50 } : undefined,
  )
  const customerItems = useMemo(
    () => (isCustomer ? normalizeFeedbackList(customerFeedbackData) : []),
    [isCustomer, customerFeedbackData],
  )
  const { totalUnseenCount: customerUnseenCount } = useUnseenResponses(customerItems)

  // 2. PO unseen triage submissions
  const { data: triageFeedbacksData } = useFeedbacks(
    isPO ? { page: 1, pageSize: 50 } : undefined,
  )
  const triageItems = useMemo(() => {
    if (!isPO || !triageFeedbacksData) return []
    return Array.isArray(triageFeedbacksData)
      ? triageFeedbacksData
      : triageFeedbacksData?.items || triageFeedbacksData?.data || triageFeedbacksData?.$values || []
  }, [isPO, triageFeedbacksData])
  const { totalUnseenCount: triageUnseenCount } = useUnseenTriageFeedbacks(triageItems)

  // 3. PO unseen company customer feedbacks
  const { data: companyFeedbackData } = useDevelopmentCompanyFeedbacks(
    isPO ? { page: 1, pageSize: 50 } : undefined,
  )
  const companyItems = useMemo(
    () => (isPO ? normalizeFeedbackList(companyFeedbackData) : []),
    [isPO, companyFeedbackData],
  )
  const { totalUnseenCount: companyUnseenCount } = usePOUnseenCompanyFeedbacks(companyItems)

  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (
      (item.to === ROUTES.workspaceCustomers || item.to === ROUTES.workspaceCustomerFeedbacks) &&
      !canAccessCustomers(user?.role, user?.companyType)
    ) {
      return false
    }

    if (item.to === ROUTES.workspaceApiKeys && !canAccessApiKeys(user?.companyType)) {
      return false
    }

    if (!item.roles) return true
    return item.roles.some((r) => String(r).toLowerCase() === String(user?.role || '').toLowerCase())
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

      {visibleNavItems.map(({ to, label, icon: Icon }) => {
        let badgeCount = 0
        if (to === ROUTES.customerFeedback && isCustomer) {
          badgeCount = customerUnseenCount
        } else if (to === ROUTES.workspaceTriage && isPO) {
          badgeCount = triageUnseenCount
        } else if (to === ROUTES.workspaceCustomerFeedbacks && isPO) {
          badgeCount = companyUnseenCount
        }

        const hasBadge = badgeCount > 0

        return (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-100',
                isActive ? 'bg-brand-50 text-brand-500 font-bold' : 'text-slate-600 font-medium',
              )
            }
          >
            <div className="relative">
              <Icon size={18} className="shrink-0" />
              {isSidebarCollapsed && hasBadge && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-brand-600 ring-2 ring-white animate-pulse" />
              )}
            </div>

            {!isSidebarCollapsed && (
              <>
                <span className="truncate">{label}</span>
                {hasBadge && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-[11px] font-bold text-white shadow-xs animate-pulse">
                    {badgeCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        )
      })}
    </aside>
  )
}

