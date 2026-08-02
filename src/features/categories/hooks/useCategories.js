import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@features/categories/api/categoriesApi.js'
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

export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: fetchCategories,
  })
}

export function useCategoryMutations() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories })

  const create = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      invalidate()
      toast.success('Category created')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to create category'))
    },
  })

  const update = useMutation({
    mutationFn: ({ id, payload }) => updateCategory(id, payload),
    onSuccess: () => {
      invalidate()
      toast.success('Category updated')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update category'))
    },
  })

  const remove = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      invalidate()
      toast.success('Category deleted')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to delete category'))
    },
  })

  return { create, update, remove }
}
