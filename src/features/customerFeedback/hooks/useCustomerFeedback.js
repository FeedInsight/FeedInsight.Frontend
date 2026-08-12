import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  submitCustomerFeedback,
  fetchCustomerFeedbackHistory,
} from '@features/customerFeedback/api/customerFeedbackApi.js'
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

export function useCustomerFeedbackHistory() {
  return useQuery({
    queryKey: QUERY_KEYS.customerFeedbackHistory,
    queryFn: fetchCustomerFeedbackHistory,
    staleTime: 1000 * 60,
  })
}

export function useSubmitCustomerFeedback() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: submitCustomerFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.customerFeedbackHistory })
      toast.success('Feedback submitted successfully')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to submit feedback'))
    },
  })
}
