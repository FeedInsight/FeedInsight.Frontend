import TenantDirectoryTable from '../components/TenantDirectoryTable'
import { Building, ShieldCheck } from 'lucide-react'

const TenantsDirectoryPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-600/20">
              <ShieldCheck size={12} className="text-brand-600" />
              Super Admin Console
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Building className="w-6 h-6 text-brand-600" />
            Tenant Directory
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            View, audit, manage, and toggle status for all tenant organizations registered on the platform.
          </p>
        </div>
      </div>

      <TenantDirectoryTable />
    </div>
  )
}

export default TenantsDirectoryPage

