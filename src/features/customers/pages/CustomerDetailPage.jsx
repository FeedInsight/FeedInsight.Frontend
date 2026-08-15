import { useParams, useNavigate } from 'react-router-dom'
import {
  User,
  Mail,
  Calendar,
  ShieldCheck,
  Lock,
  ArrowLeft,
  IdCard,
} from 'lucide-react'
import Card from '@shared/components/ui/Card.jsx'
import Badge from '@shared/components/ui/Badge.jsx'
import Spinner from '@shared/components/ui/Spinner.jsx'
import EmptyState from '@shared/components/ui/EmptyState.jsx'
import { useCompanyCustomer } from '../hooks/useCustomers.js'
import { ROUTES } from '@router/routes.js'
import { formatDateTime } from '@shared/utils/formatDate.js'

function isCustomerLocked(customer) {
  if (!customer) return false
  if (customer.isLocked === true || customer.IsLocked === true) return true
  if (customer.isActive === false || customer.IsActive === false) return true
  if (customer.status && String(customer.status).toLowerCase() === 'locked') return true
  if (customer.lockoutEnd && new Date(customer.lockoutEnd) > new Date()) return true
  return false
}

export default function CustomerDetailPage() {
  const { customerId } = useParams()
  const navigate = useNavigate()

  const { data: customer, isLoading, isError } = useCompanyCustomer(customerId)

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500 text-sm">
          <Spinner size={32} className="text-brand-600" />
          <span>Loading customer profile...</span>
        </div>
      </div>
    )
  }

  if (isError || !customer) {
    return (
      <div className="flex flex-col gap-4 max-w-xl">
        <button
          type="button"
          onClick={() => navigate(ROUTES.workspaceCustomers)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-slate-700 border border-slate-200 shadow-xs hover:bg-slate-50 w-fit"
        >
          <ArrowLeft size={14} />
          <span>Back to Customers</span>
        </button>
        <Card className="py-12 text-center border-dashed">
          <EmptyState
            icon={User}
            title="Customer not found"
            description="The requested customer profile could not be loaded or does not exist."
          />
        </Card>
      </div>
    )
  }

  const firstName = customer.firstName || ''
  const lastName = customer.lastName || ''
  const fullName = customer.fullName || `${firstName} ${lastName}`.trim() || 'Company Customer'
  const email = customer.email || '—'
  const createdAtStr =
    customer.createdAt || customer.createdDate
      ? formatDateTime(customer.createdAt || customer.createdDate)
      : null
  const isLocked = isCustomerLocked(customer)

  const getInitials = (fn, ln, em) => {
    if (fn || ln) {
      return `${(fn || '')[0] || ''}${(ln || '')[0] || ''}`.toUpperCase() || 'CU'
    }
    if (em && em !== '—') return em.substring(0, 2).toUpperCase()
    return 'CU'
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Top Navigation Control */}
      <div>
        <button
          type="button"
          onClick={() => navigate(ROUTES.workspaceCustomers)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-slate-700 border border-slate-200 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition-colors w-fit"
        >
          <ArrowLeft size={14} className="text-slate-500" />
          <span>Back to Customers</span>
        </button>
      </div>

      {/* Main Profile Header Card */}
      <Card className="flex flex-col gap-6 p-6 border border-slate-200/80 bg-white shadow-xs rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md ring-4 ring-indigo-50 shrink-0">
            {getInitials(firstName, lastName, email)}
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{fullName}</h1>
              {isLocked ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
                  <Lock size={11} className="text-rose-600" />
                  <span>Account Locked</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                  <ShieldCheck size={11} className="text-emerald-600" />
                  <span>Account Active</span>
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Mail size={13} className="text-slate-400" />
                <span className="font-medium text-slate-700">{email}</span>
              </div>
              {createdAtStr && (
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-slate-400" />
                  <span>Customer since {createdAtStr}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Fields Grid */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
            <IdCard size={16} className="text-brand-600" />
            <span>Customer Account Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                First Name
              </span>
              <p className="text-sm font-bold text-slate-900">{firstName || '—'}</p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Last Name
              </span>
              <p className="text-sm font-bold text-slate-900">{lastName || '—'}</p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Email Address
              </span>
              <p className="text-sm font-bold text-slate-900 truncate">{email}</p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Account Status
              </span>
              <p
                className={`text-sm font-bold ${
                  isLocked ? 'text-rose-700' : 'text-emerald-700'
                }`}
              >
                {isLocked ? 'Locked / Suspended' : 'Active'}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
