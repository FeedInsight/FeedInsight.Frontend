import AdminUserTable from '@features/adminUsers/components/AdminUserTable.jsx'

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-slate-900">Admin Users</h1>
      <AdminUserTable />
    </div>
  )
}
