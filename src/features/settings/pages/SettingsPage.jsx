import ProfileNameForm from '../components/ProfileNameForm'
import CustomerProfileForm from '../components/CustomerProfileForm'
import UpdatePasswordForm from '../components/UpdatePasswordForm'
import { useAuth } from '@shared/hooks/useAuth'
import { ROLES } from '@app/config/constants'
import TenantNameForm from '../components/TenantNameForm'
import { isCompanyCustomer } from '@shared/utils/roleUtils.js'

export default function SettingsPage() {
  const { user } = useAuth()
  const isProductOwner =
    user?.role === ROLES.PRODUCT_OWNER ||
    String(user?.role || '').toLowerCase() === 'productowner'
  const isCustomer = isCompanyCustomer(user?.role)

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <h1 className="text-xl font-semibold text-slate-900">
        {isCustomer ? 'Customer Account Settings' : 'Account Settings'}
      </h1>

      {isProductOwner && <TenantNameForm companyName={user?.companyName ?? ''} />}
      {isCustomer ? <CustomerProfileForm /> : <ProfileNameForm />}
      <UpdatePasswordForm />
    </div>
  )
}

