import { Copy } from 'lucide-react'
import Card from '@shared/components/ui/Card.jsx'
import Button from '@shared/components/ui/Button.jsx'
import Badge from '@shared/components/ui/Badge.jsx'
import { ENDPOINTS } from '@shared/api/endpoints.js'
import { HTTP_HEADERS } from '@app/config/constants.js'
import toast from 'react-hot-toast'

const SNIPPETS = [
  {
    label: 'cURL',
    language: 'bash',
    getCode: (tenantId, apiKey) => `curl -X POST "${ENDPOINTS.feedback.submit}" \\
  -H "${HTTP_HEADERS.TENANT_ID}: ${tenantId}" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -F "message=Your feedback"`,
  },
  {
    label: 'JavaScript (fetch)',
    language: 'javascript',
    getCode: (tenantId, apiKey) => `const response = await fetch('${ENDPOINTS.feedback.submit}', {
  method: 'POST',
  headers: {
    '${HTTP_HEADERS.TENANT_ID}': '${tenantId}',
    Authorization: 'Bearer ${apiKey}',
  },
  body: new FormData(),
})`,
  },
  {
    label: 'Python (requests)',
    language: 'python',
    getCode: (tenantId, apiKey) => `import requests

response = requests.post(
    '${ENDPOINTS.feedback.submit}',
    headers={
        '${HTTP_HEADERS.TENANT_ID}': '${tenantId}',
        'Authorization': 'Bearer ${apiKey}',
    },
    files={'file': open('screenshot.png', 'rb')},
)` ,
  },
]

export default function IngestionCodeSnippets({ tenantId, ingestionApiKey }) {
  const tenantValue = tenantId || 'YOUR_TENANT_ID'
  const keyValue = ingestionApiKey || 'YOUR_INGESTION_API_KEY'

  const copyToClipboard = async (content) => {
    await navigator.clipboard.writeText(content)
    toast.success('Copied to clipboard')
  }

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Ingestion examples</h2>
        <p className="text-sm text-slate-500">Use these snippets to send feedback from your own service.</p>
      </div>

      <div className="flex flex-col gap-3">
        {SNIPPETS.map((snippet) => (
          <div key={snippet.label} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-slate-700">{snippet.label}</p>
                <Badge className="bg-slate-100 text-slate-700">{snippet.language}</Badge>
              </div>
              <Button size="sm" variant="secondary" onClick={() => copyToClipboard(snippet.getCode(tenantValue, keyValue))}>
                <Copy size={16} />
                Copy
              </Button>
            </div>
            <pre className="overflow-x-auto rounded bg-slate-950 p-3 text-xs leading-6 text-slate-100">
              <code>{snippet.getCode(tenantValue, keyValue)}</code>
            </pre>
          </div>
        ))}
      </div>
    </Card>
  )
}
