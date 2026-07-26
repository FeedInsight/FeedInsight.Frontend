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

/** Separate query (not merged into useStoryDetail) because duplicate
 * matches are a heavier Qdrant call the reviewer may not always need to
 * see immediately -- DuplicateMatchPanel can lazy-load this on expand. */
export function useStoryDuplicates(storyId) {
  return useQuery({
    queryKey: [...QUERY_KEYS.story(storyId), 'duplicates'],
    queryFn: () => fetchStoryDuplicates(storyId),
    enabled: Boolean(storyId),
  })
}
