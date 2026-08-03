import Card from '@shared/components/ui/Card.jsx'
import Badge from '@shared/components/ui/Badge.jsx'
import { formatRelative } from '@shared/utils/formatDate.js'
import { cn } from '@shared/utils/classNames.js'
import { Layers } from 'lucide-react'

/**
 * Single feedback item rendered in the AI Triage Inbox list panel.
 * Shows feedback preview, submission date, status, split task count, and active selection state.
 */
export default function FeedbackListItem({ item, isSelected, onClick }) {
  const rawTasks = item.extractedTasks ?? item.tasks ?? item.$values
  const taskCount =
    item.tasksCount ??
    item.extractedTasksCount ??
    (Array.isArray(rawTasks) ? rawTasks.length : Array.isArray(rawTasks?.items) ? rawTasks.items.length : 0)
  const previewText = item.rawContent || item.title || item.preview || item.content || 'No content provided'

  return (
    <Card
      onClick={onClick}
      className={cn(
        'cursor-pointer transition-all hover:border-brand-300',
        isSelected ? 'border-brand-500 bg-brand-50/40 shadow-sm ring-1 ring-brand-500' : 'border-slate-200 bg-white',
      )}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <p className="line-clamp-2 text-sm font-medium text-slate-800">{previewText}</p>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{formatRelative(item.createdAt || item.submissionDate)}</span>

          <div className="flex items-center gap-2">
            {item.status && (
              <Badge className="bg-slate-100 text-slate-700">
                {item.status}
              </Badge>
            )}

            <div className="flex items-center gap-1 font-medium text-brand-600">
              <Layers size={13} />
              <span>{taskCount} {taskCount === 1 ? 'task' : 'tasks'}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
