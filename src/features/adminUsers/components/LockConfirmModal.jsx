import { Loader2 } from 'lucide-react'

/**
 * Confirmation modal shown before locking a Product Owner account.
 * NOTE: built as a self-contained overlay since I don't have your shared
 * Modal component (if one exists, e.g. used by InviteUserModal.jsx, send it
 * over and I'll refactor this to reuse it instead).
 */
export default function LockConfirmModal({ isOpen, email, isSubmitting, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lock-confirm-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="lock-confirm-title" className="text-base font-semibold text-slate-800">
          Lock account?
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Are you sure you want to lock access for <span className="font-medium text-slate-700">{email}</span>?
          They won&apos;t be able to sign in until unlocked.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Locking...
              </span>
            ) : (
              'Lock account'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}