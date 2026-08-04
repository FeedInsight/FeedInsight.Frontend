import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { registerAdmin } from '@features/auth/api/authApi.js'

/**
 * Hook for registering a new Super Admin.
 * POST /api/Auth/register-admin
 * Payload: { firstName, lastName, email, password }
 */
export function useRegisterAdmin() {
  return useMutation({
    mutationFn: registerAdmin,
    onSuccess: () => {
      toast.success('Super Admin registered successfully!')
    },
    onError: (error) => {
      const responseData = error?.response?.data
      const message =
        responseData?.title ||
        responseData?.message ||
        responseData?.detail ||
        (typeof responseData === 'string' ? responseData : null) ||
        'Failed to register Super Admin. Please try again.'

      toast.error(message)
    },
  })
}
