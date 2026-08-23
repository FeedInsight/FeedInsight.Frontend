import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { register } from '@features/auth/api/authApi.js'
import { ROUTES } from '@router/routes.js'

export function useRegister() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: register,
    onSuccess: (result) => {
      const response = result?.data ?? result
      const userId = response?.userId ?? response?.data?.userId ?? response?.id

      if (userId) {
        toast.success('Account created successfully. Please log in to continue.')
        navigate(ROUTES.login)
        return
      }

      toast.success('Account created successfully!')
      navigate(ROUTES.login)
    },
    onError: (error) => {
      const responseData = error?.response?.data
      const validationErrors = responseData?.errors

      let message =
        responseData?.title ||
        responseData?.message ||
        responseData?.detail ||
        (typeof responseData === 'string' ? responseData : null) ||
        'Registration failed. Please check your details and try again.'

      if (validationErrors && typeof validationErrors === 'object') {
        const firstError = Object.values(validationErrors)
          .flatMap((value) => (Array.isArray(value) ? value : [value]))
          .find(Boolean)

        if (firstError) {
          message = firstError
        }
      }

      console.error('Registration error:', error)
      toast.error(message)
    },
  })
}
