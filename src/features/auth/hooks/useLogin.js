import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { login } from '@features/auth/api/authApi.js'
import { useAuthStore } from '@app/store/authStore.js'
import { useTenantStore } from '@app/store/tenantStore.js'
import { ROUTES } from '@router/routes.js'

/** Backing hook for LoginForm. On success: hydrate authStore + tenantStore
 * together (tenant comes from the logged-in user's TenantId, per
 * tenantStore.js's documented resolution strategy for the Admin Portal),
 * then redirect into the app. */
export function useLogin() {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)
  const setTenant = useTenantStore((s) => s.setTenant)

  return useMutation({
    mutationFn: login,
    onSuccess: ({ token, user }) => {
      setSession(token, user)
      setTenant(user.tenantId)
      navigate(ROUTES.adminDashboard)
    },
    onError: () => {
      toast.error('Invalid email or password.')
    },
  })
}
