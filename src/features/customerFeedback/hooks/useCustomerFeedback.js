import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  submitDevelopmentCustomerFeedback,
  fetchDevelopmentCustomerFeedbacks,
  fetchDevelopmentCompanyFeedbacks,
  addDevelopmentCompanyComment,
} from '../api/customerFeedbackApi.js'
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

/**
 * Hook to retrieve feedbacks submitted by the logged-in customer (Company Customer).
 * @param {{ page?: number, pageSize?: number }} params
 * @param {import('@tanstack/react-query').UseQueryOptions} [options]
 */
export function useDevelopmentCustomerFeedbacks(params = {}, options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.developmentCustomerFeedbacks(params),
    queryFn: () => fetchDevelopmentCustomerFeedbacks(params),
    ...options,
  })
}

/**
 * Hook to submit feedback as a Company Customer.
 */
export function useSubmitDevelopmentCustomerFeedback() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: submitDevelopmentCustomerFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['development-feedbacks'] })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.customerFeedbackHistory })
      toast.success('Feedback submitted successfully!')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to submit feedback.'))
    },
  })
}

/**
 * Hook to retrieve all customer feedbacks for the tenant (Development Product Owner).
 * @param {{ page?: number, pageSize?: number }} params
 * @param {import('@tanstack/react-query').UseQueryOptions} [options]
 */
export function useDevelopmentCompanyFeedbacks(params = {}, options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.developmentCompanyFeedbacks(params),
    queryFn: () => fetchDevelopmentCompanyFeedbacks(params),
    ...options,
  })
}

/**
 * Hook for Development Product Owner to post a comment under a customer feedback.
 */
export function useAddDevelopmentCompanyComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ feedbackId, content }) =>
      addDevelopmentCompanyComment(feedbackId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['development-feedbacks'] })
      toast.success('Comment posted successfully!')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to post comment.'))
    },
  })
}

/**
 * Backward compatibility aliases
 */
export function useCustomerFeedbackHistory(params = {}, options = {}) {
  return useDevelopmentCustomerFeedbacks(params, options)
}

export function useSubmitCustomerFeedback() {
  return useSubmitDevelopmentCustomerFeedback()
}
