import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  fetchAdminUsers,
  inviteAdminUser,
  updateAdminUserRole,
  deactivateAdminUser,
} from '@features/adminUsers/api/adminUsersApi.js'
import { QUERY_KEYS } from '@app/config/constants.js'

export function useAdminUsers() {
  return useQuery({ queryKey: QUERY_KEYS.adminUsers, queryFn: fetchAdminUsers })
}

export function useAdminUserMutations() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminUsers })

  const invite = useMutation({
    mutationFn: inviteAdminUser,
    onSuccess: () => {
      invalidate()
      toast.success('Invitation sent')
    },
  })

  const updateRole = useMutation({
    mutationFn: ({ id, role }) => updateAdminUserRole(id, role),
    onSuccess: invalidate,
  })

  const deactivate = useMutation({
    mutationFn: deactivateAdminUser,
    onSuccess: () => {
      invalidate()
      toast.success('User deactivated')
    },
  })

  return { invite, updateRole, deactivate }
}
