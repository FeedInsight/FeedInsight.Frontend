import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { login } from '@features/auth/api/authApi.js'
import { useAuthStore } from '@app/store/authStore.js'
import { useTenantStore } from '@app/store/tenantStore.js'
import { getDashboardRouteForRole } from '@shared/utils/roleUtils.js'

import { env } from '@app/config/env.js'

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
      const refreshToken = response?.refreshToken
      let user = response?.user

      if (!user && response) {
        const role = Array.isArray(response.roles)
          ? response.roles[0]
          : response.roles || response.role

        user = {
          id: response.userId ?? response.id,
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          role,
          companyType: response.companyType,
          tenantId: response.tenantId || response.tenant_id || response.TenantId,
        }
      }

      if (!token) {
        toast.error('Login succeeded but response is missing token.')
        console.error('Login response missing token:', result)
        return
      }

      const jwtPayload = decodeJwtPayload(token)
      if (!user || !user.id) {
        user = {
          id: user?.id ?? jwtPayload?.sub ?? jwtPayload?.nameid,
          email: user?.email ?? jwtPayload?.email,
          firstName: user?.firstName ?? jwtPayload?.given_name,
          lastName: user?.lastName ?? jwtPayload?.family_name,
          role:
            user?.role ||
            jwtPayload?.role ||
            jwtPayload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
          companyType: user?.companyType || response?.companyType || jwtPayload?.companyType,
          tenantId:
            user?.tenantId ||
            jwtPayload?.tenantId ||
            jwtPayload?.tenant_id ||
            jwtPayload?.TenantId ||
            jwtPayload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/tenantid'],
        }
      }

      const effectiveTenantId =
        user?.tenantId ||
        response?.tenantId ||
        response?.tenant_id ||
        jwtPayload?.tenantId ||
        jwtPayload?.tenant_id ||
        jwtPayload?.TenantId ||
        jwtPayload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/tenantid'] ||
        env.devTenantId

      if (effectiveTenantId) {
        user.tenantId = effectiveTenantId
        setTenant(effectiveTenantId)
      } else {
        console.warn('Login response has no tenantId; tenant header will not be set.')
      }

      if (!user || !user.id) {
        toast.error('Login succeeded but response is missing user information.')
        console.error('Login response missing user:', result)
        return
      }

      setSession(token, user, refreshToken)

      const targetRoute = getDashboardRouteForRole(user.role)
      toast.success('Logged in successfully!')
      navigate(targetRoute)
    },
    onError: (error) => {
      const responseData = error?.response?.data
      const message =
        responseData?.title ||
        responseData?.message ||
        responseData?.detail ||
        (typeof responseData === 'string' ? responseData : null) ||
        'Login failed. Please check your credentials and try again.'
      console.error('Login error:', error)
      toast.error(message)
    },
  })
}
