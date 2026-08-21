import PageHeader from '@shared/components/ui/PageHeader.jsx'
import ProfileNameForm from '../components/ProfileNameForm.jsx'
import TenantNameForm from '../components/TenantNameForm.jsx'
import UpdatePasswordForm from '../components/UpdatePasswordForm.jsx'
import { useAuth } from '@shared/hooks/useAuth.js'
import { isCompanyCustomer } from '@shared/utils/roleUtils.js'

export default function SettingsPage() {
  const { user } = useAuth()
  const isCustomer = isCompanyCustomer(user?.role)
  const roleNormalized = String(user?.role || '').toLowerCase().replace(/[\s_-]/g, '')
  const isProductOwner =
    !isCustomer &&
    (roleNormalized === 'productowner' ||
      roleNormalized === 'po' ||
      user?.role === 'ProductOwner' ||
      user?.role === 'PO')

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <PageHeader
        title={isCustomer ? 'Customer Account Settings' : 'Account & Organization Settings'}
        description="Manage your personal profile details, organization name, and account security."
      />

      <ProfileNameForm />

      {isProductOwner && <TenantNameForm />}

      <UpdatePasswordForm />
    </div>
  )
}

