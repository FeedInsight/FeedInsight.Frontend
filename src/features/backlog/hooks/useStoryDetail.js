import { useQuery } from '@tanstack/react-query'
import { fetchStoryDetail, fetchStoryDuplicates } from '@features/backlog/api/storiesApi.js'
import { QUERY_KEYS } from '@app/config/constants.js'

export function useStoryDetail(storyId) {
  return useQuery({
    queryKey: QUERY_KEYS.story(storyId),
    queryFn: () => fetchStoryDetail(storyId),
    enabled: Boolean(storyId),
  })
}

export function useStoryDuplicates(storyId) {
  return useQuery({
    queryKey: [...QUERY_KEYS.story(storyId), 'duplicates'],
    queryFn: () => fetchStoryDuplicates(storyId),
    enabled: Boolean(storyId),
  })
}
