import { cn } from '@shared/utils/classNames.js'
import { X } from 'lucide-react'

const SIZES = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }

export default function Modal({ isOpen, onClose, title, size = 'md', children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div
        className={cn(
          'flex flex-col max-h-[90vh] w-full rounded-xl bg-white p-6 text-slate-900 shadow-lg dark:bg-slate-900 dark:text-slate-100',
          SIZES[size],
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto pr-1 -mr-4">
          {children}
        </div>
      </div>
    </div>
  )
}
