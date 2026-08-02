import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { register } from '@features/auth/api/authApi.js'
import { useAuthStore } from '@app/store/authStore.js'
import { useTenantStore } from '@app/store/tenantStore.js'
import { ROUTES } from '@router/routes.js'

/**
 * Backing hook for the registration page. On success: hydrate auth state,
 * update tenant context, and redirect into the admin dashboard.
 */
export function useRegister() {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)
  const setTenant = useTenantStore((s) => s.setTenant)

  return useMutation({
    mutationFn: register,
    onSuccess: (result) => {
      const token = result?.token ?? result?.data?.token
      const user = result?.user ?? result?.data?.user

      if (token && user) {
        setSession(token, user)
        setTenant(user.tenantId)
      }

      toast.success('Account created successfully!')
      navigate(ROUTES.workspaceDashboard)
    },
    onError: (error) => {
      const responseData = error?.response?.data
      const message =
        responseData?.title ||
        responseData?.message ||
        responseData?.detail ||
        (typeof responseData === 'string' ? responseData : null) ||
        'Registration failed. Please check your details and try again.'

      console.error('Registration error:', error)
      toast.error(message)
    },
  })
}
