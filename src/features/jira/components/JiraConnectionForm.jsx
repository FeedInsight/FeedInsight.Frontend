import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@shared/components/ui/Input.jsx'
import Button from '@shared/components/ui/Button.jsx'
import { useConfigureJiraIntegration } from '../hooks/useJira.js'

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
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      jiraUrl: '',
      personalAccessToken: '',
      webHookSecret: '',
    },
  })

  const { mutate: save, isPending } = useConfigureJiraIntegration()

  return (
    <form
      onSubmit={handleSubmit((values) => save(values))}
      className="flex flex-col gap-4"
    >
      <Input
        label="Jira base URL"
        placeholder="https://[company].atlassian.net"
        error={errors.jiraUrl?.message}
        disabled={isPending}
        {...register('jiraUrl')}
      />

      <Input
        label="Personal Access Token"
        placeholder="Enter your personal access token"
        type="password"
        error={errors.personalAccessToken?.message}
        disabled={isPending}
        {...register('personalAccessToken')}
      />

      <Input
        label="WebHook Secret"
        placeholder="Enter your webhook secret"
        type="password"
        error={errors.webHookSecret?.message}
        disabled={isPending}
        {...register('webHookSecret')}
      />

      <Button type="submit" isLoading={isPending}>
        Save
      </Button>
    </form>
  )
}
