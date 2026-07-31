import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  fetchProductOwners,
  fetchTenantLookup,
  inviteAdminUser,
  updateAdminUserRole,
  lockUser,
  unlockUser,
} from '@features/adminUsers/api/adminUsersApi.js'
import { QUERY_KEYS } from '@app/config/constants.js'

export function useProductOwners({ searchTerm, tenantId, status, page, pageSize }) {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.adminUsers,
      'productOwners',
      { searchTerm, tenantId, status, page, pageSize },
    ],
    queryFn: () => fetchProductOwners({ searchTerm, tenantId, status, page, pageSize }),
    keepPreviousData: true,
  })
}

export function useTenantLookup() {
  return useQuery({
    queryKey: QUERY_KEYS.tenantsLookup,
    queryFn: fetchTenantLookup,
  })
}

export function useAdminUserMutations() {
  const queryClient = useQueryClient()
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminUsers, exact: false })

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

  const toggleActiveState = useMutation({
    mutationFn: ({ id, isActive }) => (isActive ? lockUser(id) : unlockUser(id)),
    onSuccess: () => {
      invalidate()
      toast.success('User state updated')
    },
  })

  return { invite, updateRole, toggleActiveState }
}
