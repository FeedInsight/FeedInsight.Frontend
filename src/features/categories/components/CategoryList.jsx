import { useState } from 'react'
import { Pencil, Trash2, Plus, Check, Tags } from 'lucide-react'
import Table from '@shared/components/ui/Table.jsx'
import Button from '@shared/components/ui/Button.jsx'
import EmptyState from '@shared/components/ui/EmptyState.jsx'
import TablePagination from '@shared/components/ui/TablePagination.jsx'
import { useCategories, useCategoryMutations } from '@features/categories/hooks/useCategories.js'
import CategoryFormModal from './CategoryFormModal.jsx'
import DeleteCategoryModal from './DeleteCategoryModal.jsx'
import Badge from '@shared/components/ui/Badge.jsx'

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
  const [page, setPage] = useState(1)
  const pageSize = 10

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

  const totalItems = categories.length
  const paginatedCategories = categories.slice((page - 1) * pageSize, page * pageSize)
  const rangeStart = totalItems > 0 ? (page - 1) * pageSize + 1 : 0
  const rangeEnd = Math.min(page * pageSize, totalItems)
  const hasNextPage = page * pageSize < totalItems
  const hasPreviousPage = page > 1

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Tags className="w-6 h-6 text-brand-600" />
            Categories Directory
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure system classification categories and target routing rules for AI triage decomposition.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={openCreate} className="shadow-md shadow-brand-500/20">
          <Plus size={16} />
          <span>New Category</span>
        </Button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {!isLoading && categories.length === 0 ? (
          <div className="py-12 text-center">
            <EmptyState
              icon={Tags}
              title="No categories yet"
              description="Create your first classification target for the Router Agent."
            />
          </div>
        ) : (
          <Table>
            <Table.Head>
              <Table.Row className="bg-slate-50/80 border-b border-slate-200/80">
                <Table.Cell as="th" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Name</Table.Cell>
                <Table.Cell as="th" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Description</Table.Cell>
                <Table.Cell as="th" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">System Default</Table.Cell>
                <Table.Cell as="th" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">
                  Actions
                </Table.Cell>
              </Table.Row>
            </Table.Head>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <Table.Row>
                  <Table.Cell colSpan={4} className="text-center py-12 text-sm text-slate-500">
                    Loading categories...
                  </Table.Cell>
                </Table.Row>
              ) : (
                paginatedCategories.map((category) => {
                  const isSystemDefault = Boolean(category.isSystemDefault)
                  const deleting = isRowDeleting(category.id)

                  return (
                    <Table.Row key={category.id} className="hover:bg-slate-50/60 transition-colors">
                      <Table.Cell className="py-3 font-semibold text-slate-900 text-sm">{category.name}</Table.Cell>
                      <Table.Cell className="py-3 text-slate-600 text-sm">{category.description || '—'}</Table.Cell>
                      <Table.Cell className="py-3">
                        {isSystemDefault ? (
                          <Badge className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 font-semibold px-2.5 py-1">
                            <Check size={12} className="mr-1 inline-block text-emerald-600" />
                            Default
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-100 text-slate-500 font-medium px-2.5 py-1">
                            Custom
                          </Badge>
                        )}
                      </Table.Cell>
                      <Table.Cell className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="xs"
                            onClick={() => openEdit(category)}
                            title="Edit category"
                          >
                            <Pencil size={14} />
                            <span>Edit</span>
                          </Button>
                          <Button
                            variant="danger"
                            size="xs"
                            onClick={() => openDeleteConfirm(category)}
                            disabled={isSystemDefault || deleting}
                            isLoading={deleting}
                            loadingText="Deleting..."
                            title={
                              isSystemDefault
                                ? 'System default category cannot be deleted'
                                : 'Delete category'
                            }
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  )
                })
              )}
            </tbody>
          </Table>
        )}

        {totalItems > 0 && (
          <div className="px-5 border-t border-slate-100 bg-slate-50/40">
            <TablePagination
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              totalItems={totalItems}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              onNext={() => setPage((p) => p + 1)}
              onPrevious={() => setPage((p) => Math.max(p - 1, 1))}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>

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

