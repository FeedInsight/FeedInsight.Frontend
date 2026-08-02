import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  testJiraConnection,
  configureJiraIntegration,
  regenerateWebhookSecret,
} from '../api/jiraApi.js'
import { QUERY_KEYS } from '@app/config/constants.js'

export function useTestJiraConnection() {
  return useMutation({
    mutationFn: testJiraConnection,
    onSuccess: (result) => {
      result?.success ? toast.success('Jira connection OK') : toast.error('Jira connection failed')
    },
  })
}

export function useConfigureJiraIntegration() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: configureJiraIntegration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tenantSettings })
      toast.success('Jira integration saved')
    },
    onError: () => {
      toast.error('Failed to save Jira integration')
    },
  })
}

export function useRegenerateWebhookSecret() {
  return useMutation({ mutationFn: regenerateWebhookSecret })
}
