import JiraConnectionForm from '@features/tenantSettings/components/JiraConnectionForm.jsx'
import Card from '@shared/components/ui/Card.jsx'

export default function JiraIntegrationPage() {
  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Jira Integration</h1>
        <p className="text-sm text-slate-500">Connect FeedInsight to your Atlassian workspace and keep the webhook secret in sync.</p>
      </div>
      <Card>
        <JiraConnectionForm />
      </Card>
    </div>
  )
}
