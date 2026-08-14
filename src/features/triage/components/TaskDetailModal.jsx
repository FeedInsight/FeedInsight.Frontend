import Modal from '@shared/components/ui/Modal.jsx'
import Badge from '@shared/components/ui/Badge.jsx'
import UrgencyBadge from '@features/backlog/components/UrgencyBadge.jsx'
import { getCategoryTheme, resolveCategoryName } from '@shared/utils/categoryColors.js'
import { formatDateTime } from '@shared/utils/formatDate.js'
import { Tag, Code2, Sparkles, Layers, ShieldCheck, Calendar, Link2 } from 'lucide-react'

/**
 * Modal for inspecting an ExtractedTask in detail when selected by Product Owner.
 * Strictly Read-Only PO Review interface.
 * Uses all backend fields: extractedIntent, technicalKeywords, syncStatus, jiraSubtaskKey, userStoryId, createdAt.
 */
export default function TaskDetailModal({
  isOpen,
  onClose,
  task,
  index,
  categoryName: passedCategory,
  categoriesMap = {},
}) {
  if (!task) return null

  const categoryName = passedCategory || resolveCategoryName(task, categoriesMap)
  const categoryTheme = getCategoryTheme(categoryName)

  const rawKeywords = task.technicalKeywords ?? task.keywords ?? task.tags
  const keywords = Array.isArray(rawKeywords)
    ? rawKeywords
    : Array.isArray(rawKeywords?.$values)
    ? rawKeywords.$values
    : typeof rawKeywords === 'string' && rawKeywords.trim()
    ? rawKeywords.split(',').map((k) => k.trim()).filter(Boolean)
    : []

  const mainTitle =
    task.extractedIntent ||
    task.title ||
    task.summary ||
    task.description ||
    `Extracted Task #${index + 1}`
  const createdDateStr = task.createdAt ? formatDateTime(task.createdAt) : null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Extracted Task #${index + 1} Details`} size="lg">
      <div className="flex flex-col gap-5 text-sm text-slate-700">
        {/* Subtitle Badge & Category Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-800">
              <Sparkles size={13} className="text-indigo-600" />
              Extracted Task #{index + 1}
            </span>

            {/* Dynamic Category Badge */}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${categoryTheme.badgeClass}`}
            >
              <span className={`h-2 w-2 rounded-full ${categoryTheme.dot}`} />
              <Tag size={12} />
              <span>{categoryName}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {task.syncStatus && (
              <Badge className="bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-300">
                Sync: {task.syncStatus}
              </Badge>
            )}

            {task.jiraSubtaskKey && (
              <Badge className="bg-blue-100 text-blue-800 font-mono text-xs border border-blue-200">
                Jira: {task.jiraSubtaskKey}
              </Badge>
            )}

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

        {/* Task Title / Intent */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Task Main Title / Extracted Content
          </span>
          <h3 className="text-lg font-extrabold text-slate-900 leading-snug">{mainTitle}</h3>

          {task.description && task.description !== task.extractedIntent && (
            <div className="mt-1 rounded-xl bg-slate-50/80 p-3.5 border border-slate-200/60 leading-relaxed text-slate-700 font-sans text-xs">
              <span className="font-bold text-slate-900 block mb-1">Detailed Description:</span>
              {task.description}
            </div>
          )}
        </div>

        {/* Extracted Intent Details */}
        {task.extractedIntent && (
          <div className="flex flex-col gap-1.5 rounded-xl bg-indigo-50/60 p-4 border border-indigo-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
              <Layers size={15} className="text-indigo-600" />
              <span>Extracted AI Intent</span>
            </div>
            <p className="text-xs text-indigo-950 font-medium leading-relaxed">
              {task.extractedIntent}
            </p>
          </div>
        )}

        {/* Technical Keywords */}
        <div className="flex flex-col gap-2 rounded-xl border border-slate-200/70 bg-slate-50/40 p-4">
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
            <p className="text-xs italic text-slate-400">
              No technical keywords extracted for this task.
            </p>
          )}
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="rounded-xl border border-slate-200/80 p-3 bg-white">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium mb-1">
              <Calendar size={13} className="text-indigo-500" />
              <span>Created At</span>
            </div>
            <p className="font-semibold text-slate-900">{createdDateStr || '—'}</p>
          </div>

          <div className="rounded-xl border border-slate-200/80 p-3 bg-white">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium mb-1">
              <Link2 size={13} className="text-emerald-500" />
              <span>User Story Link</span>
            </div>
            <p className="font-semibold text-slate-900">{task.userStoryId || 'Unassigned'}</p>
          </div>

          <div className="rounded-xl border border-slate-200/80 p-3 bg-white">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium mb-1">
              <ShieldCheck size={13} className="text-emerald-500" />
              <span>Review Mode</span>
            </div>
            <p className="font-semibold text-slate-900">Read-Only PO Review</p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Sparkles size={13} className="text-indigo-500" /> AI-extracted task item (Read-Only)
          </span>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  )
}
