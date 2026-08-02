import ProfileNameForm from '@features/tenantSettings/components/ProfileNameForm'
import UpdatePasswordForm from '../components/UpdatePasswordForm'
import { useAuth } from '@shared/hooks/useAuth'
import { ROLES } from '@app/config/constants'
import TenantNameForm from '../components/TenantNameForm'

export default function TenantSettingsPage() {
  const { user } = useAuth()
  const isProductOwner = user?.role === ROLES.PRODUCT_OWNER

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <h1 className="text-xl font-semibold text-slate-900">Account Settings</h1>
      
      {isProductOwner && <TenantNameForm companyName={user?.companyName ?? ''} />}
      <ProfileNameForm />
      <UpdatePasswordForm />

    </div>
  )
}
