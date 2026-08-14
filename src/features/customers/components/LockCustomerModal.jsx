import Modal from '@shared/components/ui/Modal.jsx'
import Button from '@shared/components/ui/Button.jsx'
import { AlertTriangle, Lock } from 'lucide-react'

export default function LockCustomerModal({
  isOpen,
  customerName,
  customerEmail,
  isSubmitting,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Lock Customer Account?" size="sm">
      <div className="flex flex-col gap-4 pt-1">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs">
          <AlertTriangle size={18} className="text-amber-600 shrink-0" />
          <span>
            Locking this customer will instantly revoke their login access to the portal.
          </span>
        </div>

        <p className="text-sm text-slate-600">
          Are you sure you want to lock access for{' '}
          <span className="font-semibold text-slate-900">
            {customerName || customerEmail || 'this customer'}
          </span>
          {customerEmail && customerName ? ` (${customerEmail})` : ''}?
        </p>

        <div className="mt-3 flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={onConfirm}
            isLoading={isSubmitting}
            loadingText="Locking..."
            className="shadow-md shadow-red-500/20"
          >
            <Lock size={15} />
            <span>Lock Account</span>
          </Button>
        </div>
      </div>
    </Modal>
  )
}
