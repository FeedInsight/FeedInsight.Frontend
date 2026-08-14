import { useAuthStore } from "@app/store/authStore"
import { updateProfile, updatePassword, updateTenantProfile } from "../api/profileApi"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"

export function useUpdateProfile() {
  const { user, setSession, token } = useAuthStore()

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (_, variables) => {
      setSession(token, {
        ...user,
        firstName: variables.firstName ?? user?.firstName,
        lastName: variables.lastName ?? user?.lastName,
        email: variables.email ?? user?.email,
      })

      toast.success('Profile updated successfully')
    },
    onError: (err) => {
      const res = err?.response?.data
      const message =
        res?.title ||
        res?.message ||
        res?.detail ||
        (typeof res === 'string' ? res : null) ||
        'Failed to update profile'
      toast.error(message)
    },
  })
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      toast.success('Password updated successfully')
    },
    onError: (err) => {
      const res = err?.response?.data
      const incorrectPasswordMsg = res?.errors?.['Users.IncorrectPassword']?.[0]
      const newPasswordMsg = res?.errors?.['NewPassword']?.[0]

      if (incorrectPasswordMsg || newPasswordMsg) {
        return
      }

      const message =
        res?.title ||
        res?.message ||
        res?.detail ||
        (typeof res === 'string' ? res : null) ||
        'Failed to update password'

      toast.error(message)
    },
  })
}

export function useUpdateTenantProfile() {
  return useMutation({
    mutationFn: updateTenantProfile,
    onSuccess: () => {
      toast.success('Company profile updated successfully')
    },
    onError: () => {
      toast.error('Failed to update company profile')
    },
  })
}
