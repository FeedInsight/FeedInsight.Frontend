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

  const decodeJwtPayload = (token) => {
    try {
      const payload = token.split('.')[1]
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
      return JSON.parse(
        decodeURIComponent(
          decoded
            .split('')
            .map((ch) => `%${('00' + ch.charCodeAt(0).toString(16)).slice(-2)}`)
            .join(''),
        ),
      )
    } catch {
      return null
    }
  }

  return useMutation({
    mutationFn: login,
    onSuccess: (result) => {
      const response = result?.data ?? result
      const token = response?.accessToken ?? response?.token
      let user = response?.user

      if (!user && response) {
        const role = Array.isArray(response.roles)
          ? response.roles[0]
          : response.roles || response.role

        user = {
          id: response.userId ?? response.id,
          email: response.email,
          fullName: [response.firstName, response.lastName].filter(Boolean).join(' '),
          role,
          tenantId: response.tenantId,
        }
      }

      if (!token) {
        toast.error('Login succeeded but response is missing token.')
        console.error('Login response missing token:', result)
        return
      }

      if (!user || !user.id) {
        const jwtPayload = decodeJwtPayload(token)
        user = {
          id: user?.id ?? jwtPayload?.sub,
          email: user?.email ?? jwtPayload?.email,
          fullName:
            user?.fullName ||
            [jwtPayload?.given_name, jwtPayload?.family_name].filter(Boolean).join(' '),
          role:
            user?.role ||
            jwtPayload?.role ||
            jwtPayload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
          tenantId:
            user?.tenantId ||
            jwtPayload?.tenantId ||
            jwtPayload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/tenantid'],
        }
      }

      if (!user || !user.id) {
        toast.error('Login succeeded but response is missing user information.')
        console.error('Login response missing user:', result)
        return
      }

      setSession(token, user)
      if (user.tenantId) {
        setTenant(user.tenantId)
      } else {
        console.warn('Login response has no tenantId; tenant header will not be set.')
      }
      navigate(ROUTES.adminDashboard)
    },
    onError: (error) => {
      const responseData = error?.response?.data
      const message =
        responseData?.title ||
        responseData?.message ||
        responseData?.detail ||
        (typeof responseData === 'string' ? responseData : null) ||
        'Login failed. Please check your details and try again.'
      toast.error('Invalid email or password.')
      console.error('Login error:', error)
      toast.error(message)
    },
  })
}
