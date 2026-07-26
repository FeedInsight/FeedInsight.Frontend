import { useState } from 'react'
import Card from '@shared/components/ui/Card.jsx'
import Button from '@shared/components/ui/Button.jsx'
import { useRegenerateWebhookSecret } from '@features/tenantSettings/hooks/useTenantSettings.js'

/**
 * Displays the Jira webhook URL to configure on Atlassian's side, plus a
 * "Regenerate secret" action. The plaintext JiraWebhookSecret is shown
 * ONLY immediately after regeneration (per api/tenantApi.js's contract) --
 * never persisted in component state beyond this session, and never
 * fetched back in plaintext on page reload.
 */
export default function WebhookSecretDisplay({ webhookUrl }) {
  const [revealedSecret, setRevealedSecret] = useState(null)
  const { mutate: regenerate, isPending } = useRegenerateWebhookSecret()

  const handleRegenerate = () => {
    regenerate(undefined, { onSuccess: (result) => setRevealedSecret(result.secret) })
  }

  return (
    <Card className="flex flex-col gap-3">
      <div>
        <p className="text-sm font-medium text-slate-700">Webhook URL</p>
        <code className="block rounded bg-slate-100 px-2 py-1 text-xs">{webhookUrl}</code>
      </div>
      {revealedSecret && (
        <div>
          <p className="text-sm font-medium text-slate-700">New webhook secret (copy now, shown once)</p>
          <code className="block rounded bg-amber-50 px-2 py-1 text-xs text-amber-800">{revealedSecret}</code>
        </div>
      )}
      <Button size="sm" variant="secondary" isLoading={isPending} onClick={handleRegenerate}>
        Regenerate secret
      </Button>
    </Card>
  )
}
