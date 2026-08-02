import Card from "@shared/components/ui/Card";

const JiraIntegrationDocs = () => {
  return (
    <Card>
      <div className="flex flex-col gap-4 text-sm">
        <p className="font-medium text-slate-700">Where to find each field</p>

        <div className="flex flex-col gap-3">
          <div>
            <p className="font-medium text-slate-800">Jira Base URL</p>
            <p className="text-xs text-slate-600">Your Atlassian site address</p>
            <p className="mt-1 text-xs text-slate-500">Found in your browser when you are logged into Jira <p className="rounded bg-slate-100 text-xs text-slate-600 inline-block">https://[company].atlassian.net</p></p>
          </div>

          <hr className="border-slate-100" />

          <div>
            <p className="font-medium text-slate-800">Personal Access Token</p>
            <p className="text-xs text-slate-600">The Base64 encoded credentials</p>
            <div className="mt-1 flex flex-col gap-0.5 text-xs font-medium text-slate-600">
              <p>1. Generate an API token: Account icon &gt; Account Settings &gt; Security &gt; Create and manage API tokens</p>
              <p>2. Encode your credentials in format <code className="bg-slate-100 px-1 rounded text-slate-700 font-mono">email:API_token</code> using Base64 (btoa)</p>
              <p>3. Paste the resulting encoded string into this field</p>
            </div>
          </div>

          <hr className="border-slate-100" />

          <div>
            <p className="font-medium text-slate-800">WebHook Secret</p>
            <p className="text-xs text-slate-600">The secret used to verify webhook payloads</p>
            <p className="mt-1 text-xs font-medium text-slate-600">
              Jira Settings &gt; System &gt; WebHooks &gt; Select your webhook &gt; Secret
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default JiraIntegrationDocs