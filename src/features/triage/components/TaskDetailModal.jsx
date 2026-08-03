import Modal from '@shared/components/ui/Modal.jsx'
import Badge from '@shared/components/ui/Badge.jsx'
import UrgencyBadge from '@features/backlog/components/UrgencyBadge.jsx'
import { getCategoryTheme } from '@shared/utils/categoryColors.js'
import { Tag, Code2, Sparkles, Layers, ShieldCheck } from 'lucide-react'

/**
 * Modal for inspecting an ExtractedTask in detail when selected by Product Owner.
 * Strictly Read-Only PO Review interface.
 */
export default function TaskDetailModal({ isOpen, onClose, task, index }) {
  if (!task) return null

  const categoryName =
    task.categoryName ||
    task.category?.name ||
    (typeof task.category === 'string' ? task.category : null) ||
    'Uncategorized'

  const categoryTheme = getCategoryTheme(categoryName)

  const rawKeywords = task.technicalKeywords ?? task.keywords ?? task.tags
  const keywords = Array.isArray(rawKeywords)
    ? rawKeywords
    : Array.isArray(rawKeywords?.$values)
    ? rawKeywords.$values
    : typeof rawKeywords === 'string' && rawKeywords.trim()
    ? rawKeywords.split(',').map((k) => k.trim()).filter(Boolean)
    : []

  const title = task.title || task.summary || `Extracted Task #${index + 1}`

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Task Details #${index + 1}`} size="lg">
      <div className="flex flex-col gap-5 text-sm text-slate-700">
        {/* Header Badges Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 p-3 border border-slate-200/80">
          <div className="flex items-center gap-2.5">
            {/* Standalone Circular Highlighted Task Counter Badge */}
            <div
              title={`Task #${index + 1}`}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 font-mono text-xs font-black text-white shadow-xs shrink-0"
            >
              {index + 1}
            </div>

            {/* Category Badge (#101) right beside the counter */}
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${categoryTheme.badgeClass}`}>
              <span className={`h-2 w-2 rounded-full ${categoryTheme.dot}`} />
              <Tag size={12} />
              {categoryName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {task.sentiment && (
              <Badge className="bg-slate-100 text-slate-700 capitalize font-medium">
                {task.sentiment}
              </Badge>
            )}
            {task.urgencyScore !== undefined && task.urgencyScore !== null && (
              <UrgencyBadge score={task.urgencyScore} />
            )}
          </div>
        </div>

        {/* Task Title & Full Description */}
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-bold text-slate-900 leading-snug">{title}</h3>
          <div className="rounded-lg bg-slate-50/70 p-3.5 border border-slate-200/60 leading-relaxed text-slate-700 font-sans text-xs">
            {task.description || 'No detailed description provided for this extracted task.'}
          </div>
        </div>

        {/* Technical Keywords (#98) */}
        <div className="flex flex-col gap-2 rounded-lg border border-slate-200/70 bg-slate-50/40 p-3.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Code2 size={15} className="text-indigo-600" />
            <span>Extracted Technical Keywords</span>
          </div>
          {keywords.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {keywords.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-2.5 py-1 text-xs font-mono font-medium text-slate-100 shadow-xs"
                >
                  <Code2 size={11} className="text-indigo-400" />
                  {kw}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs italic text-slate-400">No technical keywords extracted by AI for this task.</p>
          )}
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-lg border border-slate-200/80 p-3 bg-white">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium mb-1">
              <Layers size={13} className="text-indigo-500" />
              <span>AI Extraction Routing</span>
            </div>
            <p className="font-semibold text-slate-900">
              {task.routingTarget || task.targetSystem || 'Backlog Review Pool'}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200/80 p-3 bg-white">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium mb-1">
              <ShieldCheck size={13} className="text-emerald-500" />
              <span>Review Mode</span>
            </div>
            <p className="font-semibold text-slate-900">Strictly Read-Only PO Review</p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Sparkles size={13} className="text-indigo-500" /> AI-generated extracted task item (Read-Only)
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  )
}

