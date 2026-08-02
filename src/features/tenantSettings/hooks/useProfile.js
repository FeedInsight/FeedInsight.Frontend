import { useAuthStore } from "@app/store/authStore"
import { updateProfile, updatePassword } from "../api/profileApi"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"

export function useUpdateProfile() {
  const { user, setSession, token } = useAuthStore()

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (_, variables) => {
      setSession(token, {
        ...user,
        firstName: variables.firstName,
        lastName: variables.lastName,
      })

      toast.success('Profile updated successfully')
    },
    onError: () => {
      toast.error('Failed to update profile')
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

      toast.error('Failed to update password')
    },
  })
}
