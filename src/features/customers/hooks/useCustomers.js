import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  fetchCompanyCustomers,
  fetchCompanyCustomerById,
  createCompanyCustomer,
  deleteCustomer,
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


