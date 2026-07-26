import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@features/categories/api/categoriesApi.js'
import { QUERY_KEYS } from '@app/config/constants.js'

/** Read hook for CategoryList. */
export function useCategories() {
  return useQuery({ queryKey: QUERY_KEYS.categories, queryFn: fetchCategories })
}

/**
 * Write hooks for CategoryFormModal (create + update share one component,
 * so both mutations are exposed from a single hook keyed by `id`).
 * Each mutation invalidates the categories list on success so CategoryList
 * refetches without manual cache surgery.
 */
export function useCategoryMutations() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories })

  const create = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      invalidate()
      toast.success('Category created')
    },
  })

  const update = useMutation({
    mutationFn: ({ id, payload }) => updateCategory(id, payload),
    onSuccess: () => {
      invalidate()
      toast.success('Category updated')
    },
  })

  const remove = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      invalidate()
      toast.success('Category removed')
    },
  })

  return { create, update, remove }
}
