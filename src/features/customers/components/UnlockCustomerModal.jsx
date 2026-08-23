import Modal from '@shared/components/ui/Modal.jsx'
import Button from '@shared/components/ui/Button.jsx'
import { CheckCircle2, Unlock } from 'lucide-react'

export default function UnlockCustomerModal({
  isOpen,
  customerName,
  customerEmail,
  isSubmitting,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Unlock Customer Account" size="sm">
      <div className="flex flex-col gap-4 pt-1">
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Restore Login Access</p>
            <p className="text-emerald-800 mt-0.5">
              Unlocking this customer will immediately allow them to log in and access all workspace customer features.
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600">
          Are you sure you want to unlock access for{' '}
          <span className="font-semibold text-slate-900">
            {customerName || customerEmail || 'this customer'}
          </span>
          {customerEmail && customerName ? (
            <span className="text-slate-500 font-normal"> ({customerEmail})</span>
          ) : null}
          ?
        </p>

        <div className="mt-2 flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
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
            variant="primary"
            size="md"
            onClick={onConfirm}
            isLoading={isSubmitting}
            loadingText="Unlocking..."
            className="shadow-md shadow-brand-500/20 bg-emerald-600 hover:bg-emerald-700 border-transparent text-white"
          >
            <Unlock size={15} />
            <span>Unlock Account</span>
          </Button>
        </div>
      </div>
    </Modal>
  )
}
