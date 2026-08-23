import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  fetchUserStories,
  syncUserStoryToJira,
  updateUserStory,
} from '@features/backlog/api/storiesApi.js'
import { QUERY_KEYS } from '@app/config/constants.js'

function getErrorMessage(error, fallback) {
  return (
    error?.response?.data?.title ??
    error?.response?.data?.data?.message ??
    error?.response?.data?.message ??
    error?.response?.data?.error ??
    error?.message ??
    fallback
  )
}

export function useUserStories(filters = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.userStories, filters],
    queryFn: () => fetchUserStories(filters),
    keepPreviousData: true,
  })
}

export function useUserStoryMutations() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userStories })

  const update = useMutation({
    mutationFn: ({ id, payload }) => updateUserStory(id, payload),
    onSuccess: () => {
      invalidate()
      toast.success('Story updated')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update story'))
    },
  })

  const sync = useMutation({
    mutationFn: (id) => syncUserStoryToJira(id),
    onSuccess: () => {
      invalidate()
      toast.success('Story synced to Jira')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to sync story to Jira'))
    },
  })

  return { update, sync }
}
