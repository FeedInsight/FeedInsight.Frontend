import AdminUserTable from '@features/adminUsers/components/AdminUserTable.jsx'
import PageHeader from '@shared/components/ui/PageHeader'

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Product Owners"
        description="Manage product owners, platform tenant accounts, and user security permissions across all tenants."
      />

      <AdminUserTable />
    </div>
  )
}
