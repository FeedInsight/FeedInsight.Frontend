import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  fetchCompanyCustomers,
  fetchCompanyCustomerById,
  createCompanyCustomer,
  updateCustomer,
  deleteCustomer,
  lockCustomer,
  unlockCustomer,
} from '../api/customersApi.js'
import { QUERY_KEYS } from '@app/config/constants.js'

/**
 * Hook to retrieve paginated company customers.
 * @param {{ page?: number, pageSize?: number, searchTerm?: string }} params
 */
export function useCompanyCustomers(params = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.customers(params),
    queryFn: () => fetchCompanyCustomers(params),
  })
}

/**
 * Hook to retrieve single customer details by id.
 * @param {string} id
 */
export function useCompanyCustomer(id) {
  return useQuery({
    queryKey: QUERY_KEYS.customerDetail(id),
    queryFn: () => fetchCompanyCustomerById(id),
    enabled: Boolean(id),
  })
}

/**
 * Hook to create a new customer.
 */
export function useCreateCompanyCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCompanyCustomer,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      toast.success('Customer created successfully!')
      return data
    },
    onError: (error) => {
      const responseData = error?.response?.data
      const message =
        responseData?.title ||
        responseData?.message ||
        responseData?.detail ||
        (typeof responseData === 'string' ? responseData : null) ||
        'Failed to create customer. Please check the details and try again.'
      toast.error(message)
    },
  })
}

/**
 * Hook to update an existing customer.
 */
export function useUpdateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...payload }) => updateCustomer(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.customerDetail(variables.id) })
      }
      toast.success('Customer profile updated successfully!')
      return data
    },
    onError: (error) => {
      const responseData = error?.response?.data
      const message =
        responseData?.title ||
        responseData?.message ||
        responseData?.detail ||
        (typeof responseData === 'string' ? responseData : null) ||
        'Failed to update customer profile.'
      toast.error(message)
    },
  })
}

/**
 * Hook to delete a customer.
 */
export function useDeleteCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      if (id) {
        queryClient.removeQueries({ queryKey: QUERY_KEYS.customerDetail(id) })
      }
      toast.success('Customer deleted successfully!')
      return data
    },
    onError: (error) => {
      const responseData = error?.response?.data
      const message =
        responseData?.title ||
        responseData?.message ||
        responseData?.detail ||
        (typeof responseData === 'string' ? responseData : null) ||
        'Failed to delete customer.'
      toast.error(message)
    },
  })
}

/**
 * Hook to lock a customer account.
 */
export function useLockCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }) => lockCustomer(id, reason),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.customerDetail(variables.id) })
      }
      toast.success('Customer account locked successfully!')
      return data
    },
    onError: (error) => {
      const responseData = error?.response?.data
      const message =
        responseData?.title ||
        responseData?.message ||
        responseData?.detail ||
        (typeof responseData === 'string' ? responseData : null) ||
        'Failed to lock customer account.'
      toast.error(message)
    },
  })
}

/**
 * Hook to unlock a customer account.
 */
export function useUnlockCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => unlockCustomer(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      if (id) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.customerDetail(id) })
      }
      toast.success('Customer account unlocked successfully!')
      return data
    },
    onError: (error) => {
      const responseData = error?.response?.data
      const message =
        responseData?.title ||
        responseData?.message ||
        responseData?.detail ||
        (typeof responseData === 'string' ? responseData : null) ||
        'Failed to unlock customer account.'
      toast.error(message)
    },
  })
}
