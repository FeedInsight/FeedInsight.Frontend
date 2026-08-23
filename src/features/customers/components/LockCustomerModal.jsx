import { useState, useEffect } from 'react'
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
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (isOpen) {
      setReason('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onConfirm(reason)
  }

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Lock Customer Account" size="sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-1">
        <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs">
          <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Immediate Access Revocation</p>
            <p className="text-amber-800 mt-0.5">
              Locking this customer will prevent them from logging in and accessing customer features.
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600">
          Are you sure you want to lock access for{' '}
          <span className="font-semibold text-slate-900">
            {customerName || customerEmail || 'this customer'}
          </span>
          {customerEmail && customerName ? ` (${customerEmail})` : ''}?
        </p>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="lock-customer-reason"
            className="text-xs font-semibold text-slate-700 flex items-center justify-between"
          >
            <span>Reason for Lock</span>
            <span className="text-[11px] font-normal text-slate-400">Optional</span>
          </label>
          <textarea
            id="lock-customer-reason"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Account suspended, security concern, requested by admin..."
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 shadow-2xs focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
            disabled={isSubmitting}
          />
        </div>

        <div className="mt-1 flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
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
            type="submit"
            variant="danger"
            size="md"
            isLoading={isSubmitting}
            loadingText="Locking..."
            className="shadow-md shadow-red-500/20"
          >
            <Lock size={15} />
            <span>Lock Account</span>
          </Button>
        </div>
      </form>
    </Modal>
  )
}
