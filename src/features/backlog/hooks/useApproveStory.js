import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { approveStory, rejectStory, publishStoryToJira } from '@features/backlog/api/storiesApi.js'
import { QUERY_KEYS } from '@app/config/constants.js'

/**
 * Groups the three terminal actions a reviewer can take on a draft story in
 * StoryDetailPage / ApprovalActions.jsx: approve, reject, publish-to-Jira.
 * All three invalidate both the single-story cache and the draft list so
 * BacklogReviewPage's list reflects the new status immediately.
 */
export function useApproveStory(storyId) {
  const queryClient = useQueryClient()
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.story(storyId) })
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.draftStories })
  }

  const approve = useMutation({
    mutationFn: (payload) => approveStory(storyId, payload),
    onSuccess: () => {
      invalidate()
      toast.success('Story approved')
    },
  })

  const reject = useMutation({
    mutationFn: (reason) => rejectStory(storyId, reason),
    onSuccess: () => {
      invalidate()
      toast.success('Story rejected')
    },
  })

  const publish = useMutation({
    mutationFn: () => publishStoryToJira(storyId),
    onSuccess: () => {
      invalidate()
      toast.success('Published to Jira')
    },
  })

  return { approve, reject, publish }
}
