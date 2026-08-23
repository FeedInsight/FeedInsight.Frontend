import Modal from '@shared/components/ui/Modal.jsx'
import Button from '@shared/components/ui/Button.jsx'
import { AlertTriangle } from 'lucide-react'

export default function DeleteCustomerModal({
  isOpen,
  customerName,
  customerEmail,
  isSubmitting,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Delete Customer Account" size="sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 rounded-xl bg-rose-50 p-3 text-rose-800 border border-rose-200">
          <AlertTriangle size={24} className="text-rose-600 shrink-0" />
          <div className="text-xs">
            <p className="font-semibold">This action cannot be undone.</p>
            <p className="text-rose-700">
              The customer account and all associated permissions will be permanently removed.
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600">
          Are you sure you want to delete{' '}
          <strong className="text-slate-900">{customerName || customerEmail || 'this customer'}</strong>?
        </p>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="secondary" size="sm" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onConfirm}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Delete Customer
          </Button>
        </div>
      </div>
    </Modal>
  )
}
