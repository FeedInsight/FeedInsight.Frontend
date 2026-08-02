import JiraConnectionForm from '../components/JiraConnectionForm.jsx'
import Card from '@shared/components/ui/Card.jsx'
import JiraIntegrationDocs from '../components/JiraIntegrationDocs.jsx'

export default function JiraIntegrationPage() {
  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Jira Integration</h1>
        <p className="text-sm text-slate-500">Connect FeedInsight to your Atlassian workspace and keep the webhook secret in sync.</p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
        <Card className="flex-1">
          <JiraConnectionForm />
        </Card>

        <JiraIntegrationDocs />
      </div>
    </div>
  )
}
