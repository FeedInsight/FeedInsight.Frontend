import TenantDirectoryTable from '../components/TenantDirectoryTable'

const TenantsDirectoryPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tenant Directory</h1>
      </div>
      <TenantDirectoryTable />
    </div>
  )
}

export default TenantsDirectoryPage
