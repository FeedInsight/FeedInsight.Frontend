import { useState } from 'react'
import Card from '@shared/components/ui/Card.jsx'
import Badge from '@shared/components/ui/Badge.jsx'
import UrgencyBadge from '@features/backlog/components/UrgencyBadge.jsx'
import TaskDetailModal from './TaskDetailModal.jsx'
import { getCategoryTheme, resolveCategoryName } from '@shared/utils/categoryColors.js'
import { formatDateTime } from '@shared/utils/formatDate.js'
import { Tag, Code2, ArrowRight, Calendar, Sparkles, Layers, Link2 } from 'lucide-react'

/**
 * Display card for an ExtractedTask generated from customer feedback.
 * Features:
 * - "Extracted Task #{index + 1}" as a small subtitle / header tag
 * - Main Title set to the extracted task content itself / extractedIntent
 * - Category badge resolved using tenant categories map and dynamic theme
 * - Full support for backend fields: extractedIntent, technicalKeywords, syncStatus, jiraSubtaskKey, userStoryId, createdAt
 * Strictly Read-Only PO Review interface.
 */
export default function ExtractedTaskCard({ task, index, categoriesMap = {} }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const categoryName = resolveCategoryName(task, categoriesMap)
  const categoryTheme = getCategoryTheme(categoryName)

  // Technical keywords string ("ui, design, responsiveness") or array
  const rawKeywords = task.technicalKeywords ?? task.keywords ?? task.tags
  const keywords = Array.isArray(rawKeywords)
    ? rawKeywords
    : Array.isArray(rawKeywords?.$values)
      ? rawKeywords.$values
      : typeof rawKeywords === 'string' && rawKeywords.trim()
        ? rawKeywords
            .split(',')
            .map((k) => k.trim())
            .filter(Boolean)
        : []

  // Main task content / title prioritization
  const mainTitle =
    task.extractedIntent ||
    task.title ||
    task.summary ||
    task.description ||
    `Extracted Sub-Task #${index + 1}`
  const createdDateStr = task.createdAt ? formatDateTime(task.createdAt) : null

  return (
    <>
      <Card
        onClick={() => setIsModalOpen(true)}
        className="group relative flex flex-col gap-3.5 border border-slate-200/90 bg-white p-4.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md cursor-pointer rounded-2xl dark:border-slate-700 dark:bg-slate-900"
      >
        {/* Accent Bar on hover */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl bg-transparent transition-all group-hover:bg-indigo-600" />

        {/* Top Bar: Subtitle "Extracted Task #1", Category Badge, Sync Status, Jira Key */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-700">
          <div className="flex flex-wrap items-center gap-2">
            {/* Small Subtitle & Index Counter */}
            <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 ring-1 ring-inset ring-indigo-600/20 dark:bg-indigo-950 dark:text-indigo-300">
              <Sparkles size={13} className="text-indigo-600" />
              Extracted Task #{index + 1}
            </span>

            {/* Dynamic Category Badge */}
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${categoryTheme.badgeClass} shadow-2xs`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${categoryTheme.dot}`} />
              <Tag size={11} />
              <span>{categoryName}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Sync Status Badge */}
            {task.syncStatus && (
              <Badge className="bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                {task.syncStatus}
              </Badge>
            )}

            {/* Jira Subtask Key if present */}
            {task.jiraSubtaskKey && (
              <Badge className="bg-blue-50 text-blue-700 font-mono text-[11px] border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
                Jira: {task.jiraSubtaskKey}
              </Badge>
            )}

            {task.sentiment && (
              <Badge className="bg-slate-100 text-slate-700 capitalize font-medium text-[11px] dark:bg-slate-800 dark:text-slate-300">
                {task.sentiment}
              </Badge>
            )}
            {task.urgencyScore !== undefined && task.urgencyScore !== null && (
              <UrgencyBadge score={task.urgencyScore} />
            )}
          </div>
        </div>

        {/* Main Title (Task Content / Extracted Intent) */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors leading-snug dark:text-slate-100 dark:group-hover:text-indigo-300">
              {mainTitle}
            </h4>
            <span className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <ArrowRight size={16} className="text-indigo-600" />
            </span>
          </div>

          {/* Show separate description if present and different from extracted intent */}
          {task.description && task.description !== task.extractedIntent && (
            <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 dark:text-slate-300">
              {task.description}
            </p>
          )}

          {/* Extracted Intent explicitly highlighted if title was different */}
          {task.extractedIntent && (
            <div className="flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50/60 p-2 rounded-lg border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800">
              <Layers size={13} className="text-indigo-600 shrink-0" />
              <span className="font-semibold">Intent:</span>
              <span className="truncate">{task.extractedIntent}</span>
            </div>
          )}
        </div>

        {/* Technical Keywords & Footer Meta */}
        <div className="flex flex-col gap-2 border-t border-slate-100 pt-3 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
              <Code2 size={13} className="text-indigo-600" />
              <span>Technical Keywords</span>
            </div>
            {createdDateStr && (
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <Calendar size={11} />
                {createdDateStr}
              </span>
            )}
          </div>

          {keywords.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {keywords.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-0.5 font-mono text-[11px] font-medium text-slate-700 border border-slate-200/80"
                >
                  <Code2 size={10} className="text-slate-400" />
                  {kw}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs italic text-slate-400">No technical keywords extracted</p>
          )}

          {/* User Story Link ID indicator if linked */}
          {task.userStoryId && (
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium pt-1">
              <Link2 size={12} className="text-emerald-600" />
              <span>Linked User Story: {task.userStoryId}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Detail Modal when card is clicked */}
      <TaskDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={task}
        index={index}
        categoryName={categoryName}
      />
    </>
  )
}
