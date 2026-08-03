import Card from '@shared/components/ui/Card.jsx'
import Badge from '@shared/components/ui/Badge.jsx'
import { formatRelative } from '@shared/utils/formatDate.js'
import { getCategoryTheme } from '@shared/utils/categoryColors.js'
import { cn } from '@shared/utils/classNames.js'
import { User, Tag } from 'lucide-react'

/**
 * Single feedback item rendered in the AI Triage Inbox list panel.
 * Prominently highlights the standalone circular task counter badge with ONLY the counter number.
 * Strictly Read-Only PO Review item.
 */
export default function FeedbackListItem({ item, isSelected, onClick }) {
  const rawTasks = item.extractedTasks ?? item.tasks ?? item.$values
  const extractedList = Array.isArray(rawTasks)
    ? rawTasks
    : Array.isArray(rawTasks?.items)
    ? rawTasks.items
    : []

  const taskCount =
    item.tasksCount ??
    item.extractedTasksCount ??
    extractedList.length

  const previewText = item.rawContent || item.title || item.preview || item.content || 'No content provided'
  const submitterEmail = item.submitterEmail || item.email || ''

  // Extract unique category names across tasks for list item badge preview (#101)
  const categoryNames = Array.from(
    new Set(
      extractedList
        .map((t) => t.categoryName || t.category?.name || (typeof t.category === 'string' ? t.category : null))
        .filter(Boolean)
    )
  )

  return (
    <Card
      onClick={onClick}
      className={cn(
        'group relative cursor-pointer transition-all duration-200 p-4 border',
        isSelected
          ? 'border-indigo-500 bg-indigo-50/40 shadow-sm ring-2 ring-indigo-500/20'
          : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs',
      )}
    >
      {/* Active Indicator Bar */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl bg-indigo-600" />
      )}

      <div className="flex flex-col gap-2.5">
        {/* Top Header: Submitter Email + Standalone Highlighted Circular Task Counter */}
        <div className="flex items-center justify-between gap-2">
          {submitterEmail ? (
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 truncate">
              <User size={12} className="text-slate-400 shrink-0" />
              <span className="truncate">{submitterEmail}</span>
            </div>
          ) : (
            <div />
          )}

          {/* Standalone Highlighted Circular Task Counter Badge (Only the counter number inside a circle) */}
          <div
            title={`${taskCount} extracted tasks`}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 font-mono text-xs font-black text-white shadow-sm ring-2 ring-indigo-400/30 shrink-0"
          >
            {taskCount}
          </div>
        </div>

        {/* Feedback Raw Content Preview */}
        <p className="line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors leading-snug">
          {previewText}
        </p>

        {/* Bottom Row: Date, Category Badges Preview (#101), Status */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs text-slate-500">
          <span>{formatRelative(item.createdAt || item.submissionDate)}</span>

          <div className="flex items-center gap-1.5">
            {/* Category Badges Preview */}
            {categoryNames.slice(0, 2).map((cat, idx) => {
              const theme = getCategoryTheme(cat)
              return (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${theme.badgeClass}`}
                >
                  <Tag size={9} />
                  {cat}
                </span>
              )
            })}
            {categoryNames.length > 2 && (
              <span className="text-[10px] text-slate-400 font-medium">+{categoryNames.length - 2}</span>
            )}

            {item.status && (
              <Badge className="bg-slate-100 text-slate-700 text-[10px]">
                {item.status}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

