import Modal from '@shared/components/ui/Modal.jsx'
import Button from '@shared/components/ui/Button.jsx'
import { AlertTriangle } from 'lucide-react'

export default function DeleteChatModal({ isOpen, sessionTitle, isDeleting, onConfirm, onCancel }) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Delete Conversation" size="sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-3.5 text-amber-800 border border-amber-200/90 shadow-2xs">
          <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <p className="font-bold text-amber-950">Confirm Deletion</p>
            <p className="mt-1 text-amber-800">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-amber-950">
                &quot;{sessionTitle || 'this conversation'}&quot;
              </span>
              ? All message history and conversational memory for this session will be permanently
              erased.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={onConfirm}
            isLoading={isDeleting}
            loadingText="Deleting…"
          >
            Delete Conversation
          </Button>
        </div>
      </div>
    </Modal>
  )
}
