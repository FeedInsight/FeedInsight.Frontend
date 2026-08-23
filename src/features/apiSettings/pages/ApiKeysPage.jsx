import KeyManagementPanel from '@features/apiSettings/components/KeyManagementPanel.jsx'
import IngestionCodeSnippets from '@features/apiSettings/components/IngestionCodeSnippets.jsx'
import GenerateApiKeyModal from '../components/GenerateApiKeyModal'
import { useState } from 'react'
import Button from '@shared/components/ui/Button'
import { Plus } from 'lucide-react'
import PageHeader from '@shared/components/ui/PageHeader'

export default function ApiKeysPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="API Keys & Ingestion"
        description="Manage authorization keys used to securely transmit customer feedback from external apps to the ingestion pipeline."
      >
        <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)} className="shadow-md shadow-brand-500/20">
          <Plus size={16} />
          <span>Generate New Key</span>
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-6">
        <KeyManagementPanel />
        <IngestionCodeSnippets />
      </div>

      <GenerateApiKeyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

