import ProfileNameForm from '../components/ProfileNameForm.jsx'
import TenantNameForm from '../components/TenantNameForm.jsx'
import UpdatePasswordForm from '../components/UpdatePasswordForm.jsx'
import { useAuth } from '@shared/hooks/useAuth.js'
import { isCompanyCustomer } from '@shared/utils/roleUtils.js'
import { Settings, ShieldCheck } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuth()
  const isCustomer = isCompanyCustomer(user?.role)
  const isProductOwner =
    !isCustomer &&
    (user?.role === 'ProductOwner' || String(user?.role || '').toLowerCase() === 'productowner')

  const roleLabel = isCustomer
    ? 'Company Customer'
    : user?.role === 'SuperAdmin'
    ? 'Super Admin'
    : 'Product Owner'

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-brand-600" />
            <span>{isCustomer ? 'Customer Account Settings' : 'Account & Organization Settings'}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your personal profile details, organization name, and account security.
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 border border-brand-100 self-start sm:self-auto">
          <ShieldCheck size={14} />
          <span>{roleLabel}</span>
        </div>
      </div>

      {/* User Personal Profile Information */}
      <ProfileNameForm />

      {/* Organization / Tenant Information for Product Owners */}
      {isProductOwner && <TenantNameForm companyName={user?.companyName || user?.tenantName} />}

      {/* Account Security / Password Update */}
      <UpdatePasswordForm />
    </div>
  )
}
