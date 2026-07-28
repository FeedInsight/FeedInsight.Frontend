import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { login } from '@features/auth/api/authApi.js'
import { useAuthStore } from '@app/store/authStore.js'
import { useTenantStore } from '@app/store/tenantStore.js'
import { ROUTES } from '@router/routes.js'

/** Backing hook for LoginForm. On success: hydrate authStore + tenantStore
 * together when the backend returns a token/user payload. */
export function useLogin() {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)
  const setTenant = useTenantStore((s) => s.setTenant)

  return useMutation({
    mutationFn: login,
    onSuccess: (result) => {
      const token = result?.token || result?.accessToken
      const user = result?.user || result?.profile || result
      if (token && user) {
        setSession(token, user)
        setTenant(user.tenantId || user.tenant?.id || user.tenantId || 'demo-tenant')
        navigate(ROUTES.adminDashboard)
        toast.success('Signed in successfully')
        return
      }

      toast.success('Signed in successfully')
      navigate(ROUTES.login)
    },
    onError: () => {
      toast.error('Invalid email or password.')
    },
  })
}
