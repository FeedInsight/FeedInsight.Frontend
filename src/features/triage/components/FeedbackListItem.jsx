import Card from '@shared/components/ui/Card.jsx'
import Badge from '@shared/components/ui/Badge.jsx'
import { formatRelative } from '@shared/utils/formatDate.js'
import { getCategoryTheme, extractAllCategoryNames } from '@shared/utils/categoryColors.js'
import { cn } from '@shared/utils/classNames.js'
import { User, Tag, Bell } from 'lucide-react'

/**
 * Single feedback item rendered in the AI Triage Inbox list panel.
 * Displays category badges for both original customer feedback and all extracted tasks.
 * Highlights the circular task counter badge with only the counter number.
 * Strictly Read-Only PO Review item.
 */
export default function FeedbackListItem({
  item,
  isSelected,
  isUnseen = false,
  onClick,
  categoriesMap = {},
}) {
  const rawTasks = item.extractedTasks ?? item.tasks ?? item.$values
  const extractedList = Array.isArray(rawTasks)
    ? rawTasks
    : Array.isArray(rawTasks?.items)
      ? rawTasks.items
      : []

  const taskCount = item.tasksCount ?? item.extractedTasksCount ?? extractedList.length

  const previewText =
    item.rawContent || item.content || item.title || item.preview || 'No content provided'
  const submitterEmail = item.submitterEmail || item.email || ''

  // Extract all categories associated with this feedback item and its extracted tasks
  const categoryNames = extractAllCategoryNames(item, categoriesMap)

  return (
    <Card
      onClick={onClick}
      className={cn(
        'group relative cursor-pointer transition-all duration-200 p-4 border',
        isSelected
          ? 'border-indigo-500 bg-indigo-50/40 shadow-sm ring-2 ring-indigo-500/20'
          : isUnseen
            ? 'border-amber-400 ring-2 ring-amber-100/90 bg-white hover:border-amber-500 hover:shadow-xs dark:border-amber-400 dark:bg-slate-900 dark:ring-amber-500/30 dark:hover:border-amber-300'
            : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs dark:border-slate-700 dark:bg-slate-900',
      )}
    >
      {/* Active Indicator Bar */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl bg-indigo-600" />
      )}

      <div className="flex flex-col gap-2.5">
        {/* Top Header: Submitter Email + Unseen Badge + Standalone Circular Task Counter */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {submitterEmail ? (
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 truncate">
                <User size={12} className="text-slate-400 shrink-0" />
                <span className="truncate">{submitterEmail}</span>
              </div>
            ) : (
              <div />
            )}

            {isUnseen && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs animate-pulse shrink-0">
                <Bell size={10} />
                <span>New</span>
              </span>
            )}
          </div>

          {/* Standalone Highlighted Circular Task Counter Badge */}
          <div
            title={`${taskCount} extracted tasks`}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 font-mono text-xs font-black text-white shadow-sm ring-2 ring-indigo-400/30 shrink-0"
          >
            {taskCount}
          </div>
        </div>

        {/* Feedback Raw Content Preview */}
        <p className="line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors leading-snug dark:text-slate-100 dark:group-hover:text-indigo-300">
          {previewText}
        </p>

        {/* Bottom Row: Date, Category Badges Preview, Status */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
          <span>{formatRelative(item.createdAt || item.submissionDate || item.submittedAt)}</span>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {/* Category Badges Preview */}
            {categoryNames.slice(0, 2).map((cat, idx) => {
              const theme = getCategoryTheme(cat)
              return (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${theme.badgeClass}`}
                >
                  <Tag size={9} />
                  <span>{cat}</span>
                </span>
              )
            })}
            {categoryNames.length > 2 && (
              <span className="text-[10px] text-slate-400 font-medium">
                +{categoryNames.length - 2}
              </span>
            )}

            {item.status && (
              <Badge className="bg-slate-100 text-slate-700 text-[10px] dark:bg-slate-800 dark:text-slate-300">
                {item.status}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
