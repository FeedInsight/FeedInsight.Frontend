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
  useConfigureJiraIntegration,
} from '@features/tenantSettings/hooks/useTenantSettings.js'

const jiraBaseUrlSchema = z
  .string()
  .trim()
  .min(1, 'Jira base URL is required')
  .regex(/^https:\/\/([a-z0-9-]+)\.atlassian\.net$/i, 'Use https://[company].atlassian.net')

const schema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  jiraBaseUrl: jiraBaseUrlSchema,
  adminEmail: z.string().email('Enter a valid admin email'),
  jiraApiToken: z.string().optional(),
  webhookSecret: z.string().optional(),
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
  const { mutate: configureIntegration, isPending: isConfiguring } = useConfigureJiraIntegration()
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: '',
      jiraBaseUrl: '',
      adminEmail: '',
      jiraApiToken: '',
      webhookSecret: '',
    },
  })

  useEffect(() => {
    if (settings) {
      reset({
        companyName: settings.companyName ?? '',
        jiraBaseUrl: settings.jiraBaseUrl ?? '',
        adminEmail: settings.adminEmail ?? '',
        jiraApiToken: '',
        webhookSecret: '',
      })
    }
  }, [settings, reset])

  if (isLoading) return null

  return (
    <form
      onSubmit={handleSubmit((values) => {
        save({ companyName: values.companyName, jiraBaseUrl: values.jiraBaseUrl, jiraApiToken: values.jiraApiToken })
        configureIntegration({
          jiraBaseUrl: values.jiraBaseUrl,
          adminEmail: values.adminEmail,
          apiToken: values.jiraApiToken,
          webhookSecret: values.webhookSecret,
        })
      })}
      className="flex flex-col gap-4"
    >
      <Input label="Company name" error={errors.companyName?.message} {...register('companyName')} />
      <Input label="Jira base URL" error={errors.jiraBaseUrl?.message} {...register('jiraBaseUrl')} />
      <Input label="Admin email" type="email" error={errors.adminEmail?.message} {...register('adminEmail')} />
      <Input
        label="Jira API token (leave blank to keep current)"
        type="password"
        error={errors.jiraApiToken?.message}
        {...register('jiraApiToken')}
      />
      <Input
        label="Webhook secret"
        type="password"
        error={errors.webhookSecret?.message}
        {...register('webhookSecret')}
      />
      <div className="flex gap-2">
        <Button type="submit" isLoading={isSaving || isConfiguring}>
          Save
        </Button>
        <Button type="button" variant="secondary" isLoading={isTesting} onClick={() => testConnection()}>
          Test connection
        </Button>
      </div>
    </form>
  )
}
