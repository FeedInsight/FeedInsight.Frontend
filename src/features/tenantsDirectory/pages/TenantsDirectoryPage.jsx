import PageHeader from '@shared/components/ui/PageHeader'
import TenantDirectoryTable from '../components/TenantDirectoryTable'

const TenantsDirectoryPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Tenant Directory"
        description="View, audit, manage, and toggle status for all tenant organizations registered on the platform."
      />

      <TenantDirectoryTable />
    </div>
  )
}

export default TenantsDirectoryPage
