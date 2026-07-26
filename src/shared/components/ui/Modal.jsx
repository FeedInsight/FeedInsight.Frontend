import { cn } from '@shared/utils/classNames.js'
import { X } from 'lucide-react'

/**
 * Base modal used by CategoryFormModal, InviteUserModal, DuplicateMatchPanel
 * (when opened as an overlay), etc. Deliberately unopinionated about
 * content -- pass a footer via `children` composition rather than adding
 * more props here.
 *
 * Props: isOpen (bool), onClose (fn), title (string), size ('sm'|'md'|'lg')
 */
const SIZES = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }

export default function Modal({ isOpen, onClose, title, size = 'md', children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className={cn('w-full rounded-xl bg-white p-6 shadow-lg', SIZES[size])}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
