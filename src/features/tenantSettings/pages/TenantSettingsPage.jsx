import ProfileNameForm from '@features/tenantSettings/components/ProfileNameForm'

export default function TenantSettingsPage() {
  return (
    <div className="flex max-w-xl flex-col gap-6">
      <h1 className="text-xl font-semibold text-slate-900">Account Settings</h1>

      <ProfileNameForm />


      {/* <WebhookSecretDisplay webhookUrl={`${env.apiBaseUrl}/webhooks/jira`} /> */}
    </div>
  )
}
