import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { fetchTenantSettings, updateTenantSettings } from '../api/tenantApi.js'
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
