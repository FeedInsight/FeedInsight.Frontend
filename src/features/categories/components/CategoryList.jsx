import { useState } from 'react'
import { Pencil, Trash2, Plus, Check, X } from 'lucide-react'
import Table from '@shared/components/ui/Table.jsx'
import Button from '@shared/components/ui/Button.jsx'
import EmptyState from '@shared/components/ui/EmptyState.jsx'
import { useCategories, useCategoryMutations } from '@features/categories/hooks/useCategories.js'
import CategoryFormModal from './CategoryFormModal.jsx'
import DeleteCategoryModal from './DeleteCategoryModal.jsx'

export default function CategoryList() {
  const { data: rawCategories, isLoading } = useCategories()
  const categories = Array.isArray(rawCategories)
    ? rawCategories
    : Array.isArray(rawCategories?.items)
    ? rawCategories.items
    : Array.isArray(rawCategories?.data)
    ? rawCategories.data
    : Array.isArray(rawCategories?.$values)
    ? rawCategories.$values
    : []
  const { remove } = useCategoryMutations()
  const [editingCategory, setEditingCategory] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deletingCategory, setDeletingCategory] = useState(null)

  const openCreate = () => {
    setEditingCategory(null)
    setIsModalOpen(true)
  }
  const openEdit = (category) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }

  const openDeleteConfirm = (category) => {
    setDeletingCategory(category)
  }

  const handleConfirmDelete = () => {
    if (!deletingCategory) return
    remove.mutate(deletingCategory.id, {
      onSuccess: () => setDeletingCategory(null),
    })
  }

  const isRowDeleting = (id) => remove.isPending && remove.variables === id

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
        <Button size="sm" onClick={openCreate}>
          <Plus size={16} /> New category
        </Button>
      </div>

      {!isLoading && categories.length === 0 ? (
        <EmptyState
          title="No categories yet"
          description="Create your first classification target for the Router Agent."
        />
      ) : (
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell as="th">Name</Table.Cell>
              <Table.Cell as="th">Description</Table.Cell>
              <Table.Cell as="th">System Default</Table.Cell>
              <Table.Cell as="th" className="text-right">
                Actions
              </Table.Cell>
            </Table.Row>
          </Table.Head>
          <tbody>
            {isLoading ? (
              <Table.Row>
                <Table.Cell colSpan={4} className="text-center py-10 text-sm text-slate-500">
                  Loading categories...
                </Table.Cell>
              </Table.Row>
            ) : (
              categories.map((category) => {
                const isSystemDefault = Boolean(category.isSystemDefault)
                const deleting = isRowDeleting(category.id)

                return (
                  <Table.Row key={category.id}>
                    <Table.Cell className="font-medium">{category.name}</Table.Cell>
                    <Table.Cell className="text-slate-500">{category.description}</Table.Cell>
                    <Table.Cell className="pl-12">
                      {isSystemDefault ? (
                        <span className="inline-flex items-center justify-center rounded-full bg-emerald-200 p-1.5">
                          <Check
                            size={18}
                            className="text-emerald-600"
                            aria-label="Is system default"
                          />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center rounded-full bg-red-200 p-1.5">
                          <X size={18} className="text-red-500" aria-label="Not system default" />
                        </span>
                      )}
                    </Table.Cell>
                    <Table.Cell className="flex justify-end gap-2 text-right">
                      <button onClick={() => openEdit(category)} aria-label="Edit category">
                        <Pencil size={16} className="text-slate-400 hover:text-brand-600" />
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(category)}
                        disabled={isSystemDefault || deleting}
                        aria-label={
                          isSystemDefault
                            ? 'System default category cannot be deleted'
                            : 'Delete category'
                        }
                        title={
                          isSystemDefault
                            ? 'System default category cannot be deleted'
                            : 'Delete category'
                        }
                        className="disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2
                          size={16}
                          className={
                            isSystemDefault ? 'text-slate-300' : 'text-slate-400 hover:text-red-600'
                          }
                        />
                      </button>
                    </Table.Cell>
                  </Table.Row>
                )
              })
            )}
          </tbody>
        </Table>
      )}

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={editingCategory}
      />

      <DeleteCategoryModal
        isOpen={Boolean(deletingCategory)}
        categoryName={deletingCategory?.name}
        isSubmitting={remove.isPending && remove.variables === deletingCategory?.id}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingCategory(null)}
      />
    </div>
  )
}
