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
  username: z.string().min(1, 'Username is required'),
  apiKey: z.string().min(1, 'API key is required'),
})

export default function JiraConnectionForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      jiraUrl: '',
      username: '',
      apiKey: '',
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
        error={errors.jiraUrl?.message}
        disabled={isPending}
        {...register('jiraUrl')}
      />

      <Input
        label="Username"
        error={errors.username?.message}
        disabled={isPending}
        {...register('username')}
      />

      <Input
        label="Jira API Token"
        type="password"
        error={errors.apiKey?.message}
        disabled={isPending}
        {...register('apiKey')}
      />

      <Button type="submit" isLoading={isPending}>
        Save
      </Button>
    </form>
  )
}
