import { useQuery } from '@tanstack/react-query'
import { fetchDraftStories } from '@features/backlog/api/storiesApi.js'
import { QUERY_KEYS } from '@app/config/constants.js'

/** @param {{ search?: string, categoryId?: string, page?: number, pageSize?: number }} filters */
export function useDraftStories(filters = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.draftStories, filters],
    queryFn: () => fetchDraftStories(filters),
  })
}
