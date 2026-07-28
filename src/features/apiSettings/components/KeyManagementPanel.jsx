import { useState } from 'react'
import { Eye, EyeOff, Copy } from 'lucide-react'
import Card from '@shared/components/ui/Card.jsx'
import Button from '@shared/components/ui/Button.jsx'
import Badge from '@shared/components/ui/Badge.jsx'
import toast from 'react-hot-toast'

function maskValue(value, isRevealed) {
  if (!value) return '—'
  if (isRevealed) return value
  if (value.length <= 4) return value
  return `${'•'.repeat(value.length - 4)}${value.slice(-4)}`
}

export default function KeyManagementPanel({ tenantId, ingestionApiKey }) {
  const [isTenantRevealed, setIsTenantRevealed] = useState(false)
  const [isKeyRevealed, setIsKeyRevealed] = useState(false)

  const copyToClipboard = async (value) => {
    if (!value) return
    await navigator.clipboard.writeText(value)
    toast.success('Copied to clipboard')
  }

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Key management</h2>
          <p className="text-sm text-slate-500">Reveal the values when you need to copy them into your ingestion pipeline.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-slate-700">Tenant ID</p>
            <Badge className="bg-slate-100 text-slate-700">Identifier</Badge>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => setIsTenantRevealed((value) => !value)}>
              {isTenantRevealed ? <EyeOff size={16} /> : <Eye size={16} />}
              {isTenantRevealed ? 'Hide' : 'Reveal'}
            </Button>
            <Button size="sm" variant="secondary" onClick={() => copyToClipboard(tenantId)}>
              <Copy size={16} />
              Copy
            </Button>
          </div>
        </div>
        <code className="rounded bg-slate-950 px-3 py-2 text-sm text-slate-100">{maskValue(tenantId, isTenantRevealed)}</code>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-slate-700">Ingestion API key</p>
            <Badge className="bg-brand-50 text-brand-700">Secret</Badge>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => setIsKeyRevealed((value) => !value)}>
              {isKeyRevealed ? <EyeOff size={16} /> : <Eye size={16} />}
              {isKeyRevealed ? 'Hide' : 'Reveal'}
            </Button>
            <Button size="sm" variant="secondary" onClick={() => copyToClipboard(ingestionApiKey)}>
              <Copy size={16} />
              Copy
            </Button>
          </div>
        </div>
        <code className="rounded bg-slate-950 px-3 py-2 text-sm text-slate-100">{maskValue(ingestionApiKey, isKeyRevealed)}</code>
      </div>
    </Card>
  )
}
