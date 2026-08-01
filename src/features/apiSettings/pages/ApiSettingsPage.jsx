import KeyManagementPanel from '@features/apiSettings/components/KeyManagementPanel.jsx'
import IngestionCodeSnippets from '@features/apiSettings/components/IngestionCodeSnippets.jsx'

export default function ApiSettingsPage() {

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">API Keys</h1>
        <p className="text-sm text-slate-500">Use these values to publish feedback into the ingestion endpoint.</p>
      </div>

      <div className="flex flex-col gap-6">
        <KeyManagementPanel />
        <IngestionCodeSnippets />
      </div>
    </div>
  )
}
