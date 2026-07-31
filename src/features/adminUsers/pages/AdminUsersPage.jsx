import AdminUserTable from '@features/adminUsers/components/AdminUserTable.jsx'

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold text-slate-900">Admin Users</h1>
      <AdminUserTable />
    </div>
  )
}
