import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@shared/components/ui/Input.jsx'
import Button from '@shared/components/ui/Button.jsx'
import { useConfigureJiraIntegration, useJiraConfig } from '../hooks/useJira.js'
import { useEffect } from 'react'

const schema = z.object({
  jiraUrl: z
    .string()
    .trim()
    .min(1, 'Jira base URL is required')
    .regex(/^https:\/\/([a-z0-9-]+)\.atlassian\.net$/i, 'Use https://[company].atlassian.net'),
  personalAccessToken: z.string().min(1, 'Personal access token is required'),
  webHookSecret: z.string().min(1, 'WebHook secret is required'),
})

export default function JiraConnectionForm() {
  const { data: config, isLoading } = useJiraConfig()

  const isConnected =
    !!config?.jiraBaseUrl ||
    (config?.isPersonalAccessTokenConfigured && config?.isWebhookSecretConfigured)

  const isTokenConfigured = !!config?.isPersonalAccessTokenConfigured
  const isSecretConfigured = !!config?.isWebhookSecretConfigured

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      jiraUrl: '',
      personalAccessToken: '',
      webHookSecret: '',
    },
  })

  useEffect(() => {
    if (config?.jiraBaseUrl) {
      reset({ jiraUrl: config.jiraBaseUrl, personalAccessToken: '', webHookSecret: '' })
    }
  }, [config?.jiraBaseUrl, reset])

  const { mutate: save, isPending } = useConfigureJiraIntegration()

  return (
    <div className="flex flex-col gap-1">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800">Jira Connection</p>

        {!isLoading && isConnected && (
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
            Connected
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit((values) => save(values))} className="flex flex-col gap-4">
        <Input
          label="Jira base URL"
          placeholder="https://[company].atlassian.net"
          error={errors.jiraUrl?.message}
          disabled={isPending}
          {...register('jiraUrl')}
        />

        <Input
          label="Personal Access Token"
          placeholder={isTokenConfigured ? '•••••••• (Configured, enter new token to update)' : 'Enter your personal access token'}
          type="password"
          error={errors.personalAccessToken?.message}
          disabled={isPending}
          {...register('personalAccessToken')}
        />

        <Input
          label="WebHook Secret"
          placeholder={isSecretConfigured ? '•••••••• (Configured, enter new secret to update)' : 'Enter your webhook secret'}
          type="password"
          error={errors.webHookSecret?.message}
          disabled={isPending}
          {...register('webHookSecret')}
        />

        <Button type="submit" isLoading={isPending}>
          Save
        </Button>
      </form>
    </div>
  )
}
