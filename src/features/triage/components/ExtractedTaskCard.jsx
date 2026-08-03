import Card from '@shared/components/ui/Card.jsx'
import Badge from '@shared/components/ui/Badge.jsx'
import UrgencyBadge from '@features/backlog/components/UrgencyBadge.jsx'
import { Tag, Code2 } from 'lucide-react'

/**
 * Read-only display card for an ExtractedTask generated from customer feedback.
 * Satisfies Task #98 (Technical Keywords) and Task #101 (Category Badge).
 */
export default function ExtractedTaskCard({ task, index }) {
  const categoryName =
    task.categoryName ||
    task.category?.name ||
    (typeof task.category === 'string' ? task.category : null) ||
    'Uncategorized'

  const rawKeywords = task.technicalKeywords ?? task.keywords ?? task.tags
  const keywords = Array.isArray(rawKeywords)
    ? rawKeywords
    : Array.isArray(rawKeywords?.$values)
    ? rawKeywords.$values
    : typeof rawKeywords === 'string' && rawKeywords.trim()
    ? rawKeywords.split(',').map((k) => k.trim()).filter(Boolean)
    : []

  return (
    <Card className="flex flex-col gap-3 border border-slate-200 bg-slate-50/50 p-4">
      {/* Top row: Order index, Category Badge (Task #101), and Urgency/Sentiment */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-slate-500">
            Task #{index + 1}
          </span>

          {/* Task #101: Category Badge */}
          <Badge className="bg-brand-50 text-brand-700 border border-brand-200/60">
            <Tag size={11} className="mr-1 inline" />
            {categoryName}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {task.sentiment && (
            <Badge className="bg-slate-100 text-slate-600">
              {task.sentiment}
            </Badge>
          )}
          {task.urgencyScore !== undefined && task.urgencyScore !== null && (
            <UrgencyBadge score={task.urgencyScore} />
          )}
        </div>
      </div>

      {/* Task Summary / Description */}
      <div>
        <h4 className="text-sm font-semibold text-slate-900">{task.title || task.summary || `Extracted Task #${index + 1}`}</h4>
        {task.description && (
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">{task.description}</p>
        )}
      </div>

      {/* Task #98: Technical Keywords display */}
      <div className="mt-1 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Code2 size={13} />
          <span>Technical Keywords</span>
        </div>

        {keywords.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {keywords.map((kw, i) => (
              <Badge key={i} className="bg-slate-200/80 text-slate-700 font-mono text-[11px]">
                {kw}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-xs italic text-slate-400">No technical keywords extracted</p>
        )}
      </div>
    </Card>
  )
}
