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
    onError: (error) => {
      const serverMessage = error?.response?.data?.title || error?.response?.data?.message || error?.message
      if (error?.response?.status === 401) {
        toast.error(serverMessage || 'Unauthorized. A valid API key (X-Api-Key) is required to submit feedback.')
      } else {
        toast.error(serverMessage || 'Something went wrong submitting your feedback. Please try again.')
      }
    },
  })
}
