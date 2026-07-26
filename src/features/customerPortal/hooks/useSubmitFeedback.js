import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { submitFeedback } from '@features/customerPortal/api/feedbackApi.js'

/**
 * Mutation hook backing FeedbackForm. No cache invalidation needed here --
 * the Customer Portal doesn't read back any list of feedback, it's a
 * write-only, stateless surface per the README.
 */
export function useSubmitFeedback() {
  return useMutation({
    mutationFn: submitFeedback,
    onError: () => {
      toast.error('Something went wrong submitting your feedback. Please try again.')
    },
  })
}
