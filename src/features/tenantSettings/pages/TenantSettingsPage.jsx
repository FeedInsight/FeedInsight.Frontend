import JiraConnectionForm from '@features/tenantSettings/components/JiraConnectionForm.jsx'
import WebhookSecretDisplay from '@features/tenantSettings/components/WebhookSecretDisplay.jsx'
import Card from '@shared/components/ui/Card.jsx'
import { env } from '@app/config/env.js'

export default function TenantSettingsPage() {
  return (
    <div className="flex max-w-xl flex-col gap-6">
      <h1 className="text-xl font-semibold text-slate-900">Tenant Settings</h1>
      <Card>
        <JiraConnectionForm />
      </Card>
      <WebhookSecretDisplay webhookUrl={`${env.apiBaseUrl}/webhooks/jira`} />
    </div>
  )
}
