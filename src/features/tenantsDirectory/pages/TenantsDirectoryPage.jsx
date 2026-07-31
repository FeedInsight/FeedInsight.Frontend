import TenantDirectoryTable from '../components/TenantDirectoryTable'

const TenantsDirectoryPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Tenant Directory</h1>
        <p className="mt-1 text-sm text-slate-500">
          All companies registered on the FeedInsight platform.
        </p>
      </div>
      <TenantDirectoryTable />
    </div>
  )
}

export default TenantsDirectoryPage
