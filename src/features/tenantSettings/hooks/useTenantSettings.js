import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  fetchTenantSettings,
  updateTenantSettings,
  testJiraConnection,
  configureJiraIntegration,
  regenerateWebhookSecret,
} from '@features/tenantSettings/api/tenantApi.js'
import { QUERY_KEYS } from '@app/config/constants.js'

export function useTenantSettings() {
  return useQuery({ queryKey: QUERY_KEYS.tenantSettings, queryFn: fetchTenantSettings })
}

export function useUpdateTenantSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTenantSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tenantSettings })
      toast.success('Settings saved')
    },
  })
}

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
