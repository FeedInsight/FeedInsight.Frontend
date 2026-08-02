import { Copy } from 'lucide-react'
import Card from '@shared/components/ui/Card.jsx'
import Button from '@shared/components/ui/Button.jsx'
import Badge from '@shared/components/ui/Badge.jsx'
import { HTTP_HEADERS } from '@app/config/constants.js'
import toast from 'react-hot-toast'

const INGESTION_ENDPOINT = 'https://feedinsight.runasp.net/api/Ingestion/feedback'

const EXAMPLE_BODY = {
  rawContent: 'Your feedback text here',
  submitterEmail: 'user@example.com',
  metadataJson: '{"source":"web","page":"/pricing"}',
}

const SNIPPETS = [
  {
    label: 'cURL',
    language: 'bash',
    getCode: (apiKey) => `curl -X POST "${INGESTION_ENDPOINT}" \\
  -H "Content-Type: application/json" \\
  -H "${HTTP_HEADERS.API_KEY}: ${apiKey}" \\
  -d '${JSON.stringify(EXAMPLE_BODY, null, 2)
    .split('\n')
    .join('\n  ')}'`,
  },
  {
    label: 'JavaScript (fetch)',
    language: 'javascript',
    getCode: (apiKey) => `const response = await fetch('${INGESTION_ENDPOINT}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    '${HTTP_HEADERS.API_KEY}': '${apiKey}',
  },
  body: JSON.stringify(${JSON.stringify(EXAMPLE_BODY, null, 2)}),
})`,
  },
  {
    label: 'Python (requests)',
    language: 'python',
    getCode: (apiKey) => `import requests

response = requests.post(
    '${INGESTION_ENDPOINT}',
    headers={
        'Content-Type': 'application/json',
        '${HTTP_HEADERS.API_KEY}': '${apiKey}',
    },
    json=${JSON.stringify(EXAMPLE_BODY, null, 2).replace(/\n/g, '\n    ')},
)`,
  },
]

export default function IngestionCodeSnippets({ ingestionApiKey }) {
  const keyValue = ingestionApiKey || 'YOUR_INGESTION_API_KEY'

  const copyToClipboard = async (content) => {
    await navigator.clipboard.writeText(content)
    toast.success('Copied to clipboard')
  }

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Ingestion examples</h2>
        <p className="text-sm text-slate-500">
          Send feedback to <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">{INGESTION_ENDPOINT}</code>{' '}
          with the <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">{HTTP_HEADERS.API_KEY}</code> header.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {SNIPPETS.map((snippet) => (
          <div key={snippet.label} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-slate-700">{snippet.label}</p>
                <Badge className="bg-slate-100 text-slate-700">{snippet.language}</Badge>
              </div>
              <Button size="sm" variant="secondary" onClick={() => copyToClipboard(snippet.getCode(keyValue))}>
                <Copy size={16} />
                Copy
              </Button>
            </div>
            <pre className="overflow-x-auto rounded bg-slate-950 p-3 text-xs leading-6 text-slate-100">
              <code>{snippet.getCode(keyValue)}</code>
            </pre>
          </div>
        ))}
      </div>
    </Card>
  )
}
