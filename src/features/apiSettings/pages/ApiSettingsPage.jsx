import KeyManagementPanel from '@features/apiSettings/components/KeyManagementPanel.jsx'
import IngestionCodeSnippets from '@features/apiSettings/components/IngestionCodeSnippets.jsx'
import GenerateApiKeyModal from '../components/GenerateApiKeyModal'
import { useState } from 'react'
import Button from '@shared/components/ui/Button'
import { Plus } from 'lucide-react'

export default function ApiSettingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">API Keys</h1>
          <p className="text-sm text-slate-500">Use these values to publish feedback into the ingestion endpoint.</p>
        </div>

        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          Generate new key
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <KeyManagementPanel />
        <IngestionCodeSnippets />
      </div>

      <GenerateApiKeyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

    </div>
  )
}
