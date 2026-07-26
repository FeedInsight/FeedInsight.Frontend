import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import Modal from '@shared/components/ui/Modal.jsx'
import Input from '@shared/components/ui/Input.jsx'
import Textarea from '@shared/components/ui/Textarea.jsx'
import Button from '@shared/components/ui/Button.jsx'
import { useCategoryMutations } from '@features/categories/hooks/useCategories.js'

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
})

/**
 * Shared create/edit modal. `category` prop is `null` for create mode, or
 * an existing Categories row for edit mode -- form defaults switch
 * accordingly via the reset() effect below.
 */
export default function CategoryFormModal({ isOpen, onClose, category }) {
  const isEditMode = Boolean(category?.id)
  const { create, update } = useCategoryMutations()
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  useEffect(() => {
    reset({ name: category?.name ?? '', description: category?.description ?? '' })
  }, [category, reset])

  const onSubmit = async (values) => {
    if (isEditMode) {
      await update.mutateAsync({ id: category.id, payload: values })
    } else {
      await create.mutateAsync(values)
    }
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Edit category' : 'New category'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Name" error={errors.name?.message} {...register('name')} />
        <Textarea label="Description" rows={3} error={errors.description?.message} {...register('description')} />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={create.isPending || update.isPending}>Save</Button>
        </div>
      </form>
    </Modal>
  )
}
