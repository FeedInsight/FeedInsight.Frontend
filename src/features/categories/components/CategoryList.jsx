import { useState } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import Table from '@shared/components/ui/Table.jsx'
import Button from '@shared/components/ui/Button.jsx'
import EmptyState from '@shared/components/ui/EmptyState.jsx'
import { useCategories, useCategoryMutations } from '@features/categories/hooks/useCategories.js'
import CategoryFormModal from './CategoryFormModal.jsx'

/**
 * "Dynamic Category Management" table (README §Admin Portal). Owns the
 * create/edit modal's open state since it's the only consumer; if another
 * page ever needs to open this modal, lift the state up instead of
 * duplicating the modal.
 */
export default function CategoryList() {
  const { data: categories = [], isLoading } = useCategories()
  const { remove } = useCategoryMutations()
  const [editingCategory, setEditingCategory] = useState(null) // null = closed, {} = create, {...} = edit
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openCreate = () => {
    setEditingCategory(null)
    setIsModalOpen(true)
  }
  const openEdit = (category) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={openCreate}>
          <Plus size={16} /> New category
        </Button>
      </div>

      {!isLoading && categories.length === 0 ? (
        <EmptyState title="No categories yet" description="Create your first classification target for the Router Agent." />
      ) : (
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell as="th">Name</Table.Cell>
              <Table.Cell as="th">Description</Table.Cell>
              <Table.Cell as="th" className="text-right">Actions</Table.Cell>
            </Table.Row>
          </Table.Head>
          <tbody>
            {categories.map((category) => (
              <Table.Row key={category.id}>
                <Table.Cell className="font-medium">{category.name}</Table.Cell>
                <Table.Cell className="text-slate-500">{category.description}</Table.Cell>
                <Table.Cell className="flex justify-end gap-2 text-right">
                  <button onClick={() => openEdit(category)} aria-label="Edit category">
                    <Pencil size={16} className="text-slate-400 hover:text-brand-600" />
                  </button>
                  <button onClick={() => remove.mutate(category.id)} aria-label="Delete category">
                    <Trash2 size={16} className="text-slate-400 hover:text-red-600" />
                  </button>
                </Table.Cell>
              </Table.Row>
            ))}
          </tbody>
        </Table>
      )}

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={editingCategory}
      />
    </div>
  )
}
