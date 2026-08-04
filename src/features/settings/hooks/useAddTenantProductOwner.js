import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { axiosClient } from '@shared/api/axiosClient.js'
import { ENDPOINTS } from '@shared/api/endpoints.js'
import { QUERY_KEYS } from '@app/config/constants.js'

export async function addTenantOwner(payload) {
  const { data } = await axiosClient.post(ENDPOINTS.tenant.addOwner, payload)
  return data
}

export function useAddTenantProductOwner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addTenantOwner,
    onSuccess: () => {
      toast.success('Product Owner added successfully!')
      // Invalidate queries so Super Admin Product Owners directory reflects the new user immediately
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminUsers })
      queryClient.invalidateQueries({ queryKey: ['product-owners'] })
    },
    onError: (error) => {
      const responseData = error?.response?.data
      const message =
        responseData?.title ||
        responseData?.message ||
        responseData?.detail ||
        (typeof responseData === 'string' ? responseData : null) ||
        'Failed to add Product Owner. Please check the details and try again.'

      toast.error(message)
    },
  })
}
