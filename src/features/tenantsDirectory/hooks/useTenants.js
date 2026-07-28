import { QUERY_KEYS } from '@app/config/constants'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchTenants, updateTenantStatus } from '../api/tenantsApi'

export function useTenants(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.tenantsLookup, params],
    queryFn: () => fetchTenants(params),
  })
}

export function useTenantMutations() {
  const queryClient = useQueryClient()

  const toggleStatus = useMutation({
    mutationFn: updateTenantStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tenantsLookup })
    },
  })

  return { toggleStatus }
}
