import { useState } from 'react'
import Card from '@shared/components/ui/Card.jsx'
import Badge from '@shared/components/ui/Badge.jsx'
import UrgencyBadge from '@features/backlog/components/UrgencyBadge.jsx'
import TaskDetailModal from './TaskDetailModal.jsx'
import { getCategoryTheme } from '@shared/utils/categoryColors.js'
import { Tag, Code2, ArrowRight, Sparkles } from 'lucide-react'

/**
 * Advanced read-only display card for an ExtractedTask generated from customer feedback.
 * Features a standalone highlighted Task Counter badge right beside the Category badge (#101).
 * Tapping/clicking the card opens TaskDetailModal with complete AI extraction breakdown.
 */
export default function ExtractedTaskCard({ task, index }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

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
    <>
      <Card
        onClick={() => setIsModalOpen(true)}
        className="group relative flex flex-col gap-3.5 border border-slate-200/90 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md cursor-pointer"
      >
        {/* Accent Bar on hover */}
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-transparent transition-all group-hover:bg-brand-500" />

        {/* Header Row: Highlighted Task Counter, Category Badge (#101), Urgency/Sentiment */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            {/* Standalone Highlighted Task Counter Badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-2.5 py-0.5 text-xs font-extrabold text-white shadow-xs">
              <Sparkles size={11} className="text-amber-300" />
              Task #{index + 1}
            </span>

            {/* Task #101: Dynamic Category Badge beside the counter */}
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${categoryTheme.badgeClass} shadow-2xs`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${categoryTheme.dot}`} />
              <Tag size={11} />
              {categoryName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {task.sentiment && (
              <Badge className="bg-slate-100 text-slate-700 capitalize font-medium text-[11px]">
                {task.sentiment}
              </Badge>
            )}
            {task.urgencyScore !== undefined && task.urgencyScore !== null && (
              <UrgencyBadge score={task.urgencyScore} />
            )}
          </div>
        </div>

        {/* Task Title & Description */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-700 transition-colors leading-snug">
              {title}
            </h4>
            <span className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight size={14} className="text-brand-600" />
            </span>
          </div>
          {task.description && (
            <p className="mt-1 text-xs text-slate-600 leading-relaxed line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        {/* Task #98: Technical Keywords display */}
        <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
              <Code2 size={13} className="text-brand-600" />
              <span>Technical Keywords</span>
            </div>
            <span className="text-[10px] font-medium text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">
              Click to expand →
            </span>
          </div>

          {keywords.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {keywords.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-medium text-slate-700 border border-slate-200/60"
                >
                  <Code2 size={10} className="text-slate-400" />
                  {kw}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs italic text-slate-400">No technical keywords extracted</p>
          )}
        </div>
      </Card>

      {/* Interactive Detail Modal when card is tapped */}
      <TaskDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={task}
        index={index}
      />
    </>
  )
}
