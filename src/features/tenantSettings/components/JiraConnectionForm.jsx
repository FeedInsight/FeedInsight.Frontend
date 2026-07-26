import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@shared/components/ui/Input.jsx'
import Button from '@shared/components/ui/Button.jsx'
import {
  useTenantSettings,
  useUpdateTenantSettings,
  useTestJiraConnection,
} from '@features/tenantSettings/hooks/useTenantSettings.js'

const schema = z.object({
  companyName: z.string().min(1),
  jiraBaseUrl: z.string().url('Enter a valid URL, e.g. https://yourteam.atlassian.net'),
  jiraApiToken: z.string().optional(), // left blank = keep existing encrypted token server-side
})

/**
 * Maps directly to TENANTS.CompanyName / JiraBaseUrl / JiraEncryptedToken.
 * The token field is intentionally never pre-filled with the real value
 * (backend should return it masked or omitted entirely) -- submitting it
 * blank must mean "don't change the stored token", which the backend
 * PUT /tenant/settings handler needs to honor.
 */
export default function JiraConnectionForm() {
  const { data: settings, isLoading } = useTenantSettings()
  const { mutate: save, isPending: isSaving } = useUpdateTenantSettings()
  const { mutate: testConnection, isPending: isTesting } = useTestJiraConnection()
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (settings) {
      reset({ companyName: settings.companyName, jiraBaseUrl: settings.jiraBaseUrl, jiraApiToken: '' })
    }
  }, [settings, reset])

  if (isLoading) return null

  return (
    <form onSubmit={handleSubmit((values) => save(values))} className="flex flex-col gap-4">
      <Input label="Company name" error={errors.companyName?.message} {...register('companyName')} />
      <Input label="Jira base URL" error={errors.jiraBaseUrl?.message} {...register('jiraBaseUrl')} />
      <Input
        label="Jira API token (leave blank to keep current)"
        type="password"
        error={errors.jiraApiToken?.message}
        {...register('jiraApiToken')}
      />
      <div className="flex gap-2">
        <Button type="submit" isLoading={isSaving}>Save</Button>
        <Button type="button" variant="secondary" isLoading={isTesting} onClick={() => testConnection()}>
          Test connection
        </Button>
      </div>
    </form>
  )
}
