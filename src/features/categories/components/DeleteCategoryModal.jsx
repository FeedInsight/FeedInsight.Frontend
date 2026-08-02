import Modal from '@shared/components/ui/Modal.jsx'
import Button from '@shared/components/ui/Button.jsx'

export default function DeleteCategoryModal({
  isOpen,
  categoryName,
  isSubmitting,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Delete category">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-slate-600">
          Are you sure you want to delete{' '}
          <span className="font-medium text-slate-800">{categoryName}</span>? Any feedback currently
          in this category will be moved to{' '}
          <span className="font-medium text-slate-800">&quot;Uncategorized&quot;</span>. This action
          cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="button" variant="danger" onClick={onConfirm} isLoading={isSubmitting}>
            Delete category
          </Button>
        </div>
      </div>
    </Modal>
  )
}
