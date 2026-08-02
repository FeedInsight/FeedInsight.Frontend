import { useAuthStore } from "@app/store/authStore"
import { updateProfile } from "../api/profileApi"
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
    onError: (err) => {
      const msg = err?.message || 'Failed to update profile'
      toast.error(msg)
    },
  })
}
