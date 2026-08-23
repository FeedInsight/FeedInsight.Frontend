import JiraConnectionForm from '../components/JiraConnectionForm.jsx'
import Card from '@shared/components/ui/Card.jsx'
import JiraIntegrationDocs from '../components/JiraIntegrationDocs.jsx'
import PageHeader from '@shared/components/ui/PageHeader.jsx'
import { useAuth } from '@shared/hooks/useAuth.js'

export default function JiraIntegrationPage() {
  const { user } = useAuth()
  const tenantId = user?.tenantId || ''

  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <PageHeader
        title="Jira Integration"
        description="Connect FeedInsight to your Atlassian workspace and keep the webhook secret in sync."
      />

      {tenantId && (
        <Card className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700">
          <span className="font-medium">Your company id:</span>
          <code className="rounded bg-slate-100 px-1 text-slate-800">
            {tenantId}
          </code>
        </Card>
      )}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
        <Card className="flex-1">
          <JiraConnectionForm />
        </Card>

        <JiraIntegrationDocs tenantId={tenantId} />
      </div>
    </div>
  )
}
