import Card from "@shared/components/ui/Card";

const JiraIntegrationDocs = ({ tenantId }) => {
  return (
    <Card>
      <div className="flex flex-col gap-4 text-sm">
        <p className="font-medium text-slate-700">Where to find each field</p>

        <div className="flex flex-col gap-3">
          <div>
            <p className="font-medium text-slate-800">Jira Base URL</p>
            <p className="text-xs text-slate-600">Your Atlassian site address</p>
            <p className="mt-1 text-xs text-slate-500">Found in your browser when you are logged into Jira <p className="rounded bg-slate-100 px-1 text-xs text-slate-700 inline-block">https://[company].atlassian.net</p></p>
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

          <hr className="border-slate-100" />

          <div>
            <p className="font-medium text-slate-800">Webhook URL</p>
            <p className="text-xs text-slate-600">You can create webhooks by using this link:</p>
            <p className="mt-1 text-xs font-medium text-slate-600">
              <code className="rounded bg-slate-100 px-1 text-slate-700">
                https://feedinsight.runasp.net/api/webhooks/jira/{tenantId || '{Your Company Id}'}
              </code>
            </p>

            <p className="mt-3 text-xs text-slate-600">
              Make sure that you checked these three in <strong>Issue</strong>:
            </p>

            <div className="mt-2 flex flex-col gap-1 text-xs font-medium text-slate-700">
              <label className="flex items-center gap-1.5">
                <input type="checkbox" checked readOnly />
                created
              </label>

              <label className="flex items-center gap-1.5">
                <input type="checkbox" checked readOnly />
                updated
              </label>

              <label className="flex items-center gap-1.5">
                <input type="checkbox" checked readOnly />
                deleted
              </label>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default JiraIntegrationDocs