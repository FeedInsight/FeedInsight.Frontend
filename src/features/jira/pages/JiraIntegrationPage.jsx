import JiraConnectionForm from '../components/JiraConnectionForm.jsx'
import Card from '@shared/components/ui/Card.jsx'
import JiraIntegrationDocs from '../components/JiraIntegrationDocs.jsx'
import PageHeader from '@shared/components/ui/PageHeader.jsx'

export default function JiraIntegrationPage() {
  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <PageHeader
        title="Jira Integration"
        description="Connect FeedInsight to your Atlassian workspace and keep the webhook secret in sync."
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
        <Card className="flex-1">
          <JiraConnectionForm />
        </Card>

        <JiraIntegrationDocs />
      </div>
    </div>
  )
}
