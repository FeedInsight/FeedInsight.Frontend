import Spinner from '@shared/components/ui/Spinner.jsx'
import KeyManagementPanel from '@features/apiSettings/components/KeyManagementPanel.jsx'
import IngestionCodeSnippets from '@features/apiSettings/components/IngestionCodeSnippets.jsx'
import { useIngestionKeys } from '@features/apiSettings/hooks/useIngestionKeys.js'

export default function ApiSettingsPage() {
  const { data, isLoading } = useIngestionKeys()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">API Settings</h1>
        <p className="text-sm text-slate-500">Use these values to publish feedback into the ingestion endpoint.</p>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col gap-6">
          <KeyManagementPanel tenantId={data?.tenantId} ingestionApiKey={data?.ingestionApiKey} />
          <IngestionCodeSnippets tenantId={data?.tenantId} ingestionApiKey={data?.ingestionApiKey} />
        </div>
      )}
    </div>
  )
}
