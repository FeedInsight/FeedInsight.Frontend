import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { register } from '@features/auth/api/authApi.js'
import { ROUTES } from '@router/routes.js'

export function useRegister() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      toast.success('Account created successfully')
      navigate(ROUTES.login)
    },
    onError: () => {
      toast.error('Registration failed. Please try again.')
    },
  })
}
