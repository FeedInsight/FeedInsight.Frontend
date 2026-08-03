import KeyManagementPanel from '@features/apiSettings/components/KeyManagementPanel.jsx'
import IngestionCodeSnippets from '@features/apiSettings/components/IngestionCodeSnippets.jsx'
import GenerateApiKeyModal from '../components/GenerateApiKeyModal'
import { useState } from 'react'
import Button from '@shared/components/ui/Button'
import { Plus, KeyRound } from 'lucide-react'

export default function ApiKeysPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <KeyRound className="w-6 h-6 text-brand-600" />
            API Keys & Ingestion
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage authorization keys used to securely transmit customer feedback from external apps to the ingestion pipeline.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)} className="shadow-md shadow-brand-500/20">
          <Plus size={16} />
          <span>Generate New Key</span>
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

