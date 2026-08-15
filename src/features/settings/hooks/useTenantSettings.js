import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { fetchTenantSettings, updateTenantCompany } from '../api/tenantApi.js'
import { QUERY_KEYS } from '@app/config/constants.js'
import { useAuthStore } from '@app/store/authStore.js'
import { useTenantStore } from '@app/store/tenantStore.js'

/**
 * Hook to retrieve current tenant settings.
 */
export function useTenantSettings() {
  return useQuery({
    queryKey: QUERY_KEYS.tenantSettings,
    queryFn: fetchTenantSettings,
  })
}

/**
 * Hook for Product Owner (Production or Development) to update company name via PUT /api/Tenants/my-company.
 */
export function useUpdateTenantCompany() {
  const queryClient = useQueryClient()
  const { user, setSession, token } = useAuthStore()
  const { setTenant, tenantId, apiKey } = useTenantStore()

  return useMutation({
    mutationFn: updateTenantCompany,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tenantSettings })

      const newCompanyName = variables.companyName
      if (user) {
        setSession(token, {
          ...user,
          companyName: newCompanyName ?? user.companyName,
          tenantName: newCompanyName ?? user.tenantName,
        })
      }
      if (tenantId) {
        setTenant(tenantId, newCompanyName, apiKey)
      }

      toast.success('Company name updated successfully!')
      return data
    },
    onError: (err) => {
      const res = err?.response?.data
      const message =
        res?.title ||
        res?.message ||
        res?.detail ||
        (typeof res === 'string' ? res : null) ||
        'Failed to update company name. Please try again.'
      toast.error(message)
    },
  })
}

/**
 * Alias for backward compatibility
 */
export function useUpdateTenantSettings() {
  return useUpdateTenantCompany()
}
