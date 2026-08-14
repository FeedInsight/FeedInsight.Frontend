import { useState, useEffect, useMemo } from 'react'
import Card from '@shared/components/ui/Card.jsx'
import Badge from '@shared/components/ui/Badge.jsx'
import Spinner from '@shared/components/ui/Spinner.jsx'
import EmptyState from '@shared/components/ui/EmptyState.jsx'
import TablePagination from '@shared/components/ui/TablePagination.jsx'
import ExtractedTaskCard from './ExtractedTaskCard.jsx'
import { useFeedbackDetail } from '@features/triage/hooks/useFeedbacks.js'
import { useCategories } from '@features/categories/hooks/useCategories.js'
import { formatDateTime } from '@shared/utils/formatDate.js'
import { getCategoryTheme, resolveCategoryName } from '@shared/utils/categoryColors.js'
import {
  MessageSquareText,
  Layers,
  Mail,
  Calendar,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Quote,
  ArrowLeft,
  Tag,
} from 'lucide-react'

/**
 * Read-only detail workspace for selected feedback item in the AI Triage Inbox.
 * Displays the original customer feedback content alongside all extracted AI tasks.
 * Ensures categories added by any Product Owner are properly resolved and styled for both
 * the original customer feedback and all extracted tasks.
 * Strictly Read-Only PO Review interface.
 */
export default function TriageDetailWorkspace({ feedbackId, onBack }) {
  const { data: feedback, isLoading, isError } = useFeedbackDetail(feedbackId)
  const { data: rawCategories } = useCategories()
  const [subTaskPage, setSubTaskPage] = useState(1)
  const subTaskPageSize = 5

  const categoriesMap = useMemo(() => {
    const map = {}
    const cats = Array.isArray(rawCategories)
      ? rawCategories
      : Array.isArray(rawCategories?.data)
      ? rawCategories.data
      : Array.isArray(rawCategories?.items)
      ? rawCategories.items
      : Array.isArray(rawCategories?.$values)
      ? rawCategories.$values
      : []

    cats.forEach((c) => {
      if (c && c.id && c.name) {
        map[c.id] = c.name
      }
    })
    return map
  }, [rawCategories])

  useEffect(() => {
    setSubTaskPage(1)
  }, [feedbackId])

  if (!feedbackId) {
    return null
  }

  if (isLoading) {
    return (
      <Card className="flex h-full min-h-[400px] items-center justify-center border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col items-center gap-3 text-xs text-slate-500">
          <Spinner size={32} className="text-brand-600" />
          <span>Loading feedback details & AI tasks...</span>
        </div>
      </Card>
    )
  }

  if (isError || !feedback) {
    return (
      <Card className="flex h-full min-h-[400px] flex-col items-center justify-center p-8 text-center border-dashed border-rose-200 bg-rose-50/20">
        <EmptyState
          icon={MessageSquareText}
          title="Feedback details unavailable"
          description="Could not load details for the selected feedback item."
        />
        {onBack && (
          <button
            onClick={onBack}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-xs"
          >
            <ArrowLeft size={14} />
            <span>Back to Inbox List</span>
          </button>
        )}
      </Card>
    )
  }

  const rawTasks = feedback?.extractedTasks ?? feedback?.tasks ?? feedback?.$values
  const extractedTasks = Array.isArray(rawTasks)
    ? rawTasks
    : Array.isArray(rawTasks?.items)
    ? rawTasks.items
    : []

  const submitterEmail = feedback.submitterEmail || feedback.email || ''
  const dateStr = formatDateTime(feedback.createdAt || feedback.submissionDate || feedback.submittedAt)

  // Resolve category for the original customer feedback
  const feedbackCategory = resolveCategoryName(feedback, categoriesMap)
  const categoryTheme = getCategoryTheme(feedbackCategory)

  // Sub-task pagination calculations
  const totalSubTasks = extractedTasks.length
  const paginatedTasks = extractedTasks.slice((subTaskPage - 1) * subTaskPageSize, subTaskPage * subTaskPageSize)
  const rangeStart = totalSubTasks > 0 ? (subTaskPage - 1) * subTaskPageSize + 1 : 0
  const rangeEnd = Math.min(subTaskPage * subTaskPageSize, totalSubTasks)
  const hasNextSubPage = subTaskPage * subTaskPageSize < totalSubTasks
  const hasPrevSubPage = subTaskPage > 1

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header Controls (Back Button & Read-Only Badge) */}
      <div className="flex items-center justify-between gap-3">
        {onBack ? (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-slate-700 border border-slate-200 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={14} className="text-slate-500" />
            <span>Back to All Feedbacks</span>
          </button>
        ) : <div />}

        <div className="flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-100 shadow-xs">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Read-Only PO Review</span>
        </div>
      </div>

      {/* Top Card: Original Raw Customer Feedback Panel */}
      <Card className="flex flex-col gap-4 border border-slate-200/80 shadow-xs bg-white p-5 rounded-2xl">
        {/* Panel Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
              <MessageSquareText size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Original Customer Feedback</h2>
              <p className="text-[11px] text-slate-500">Submitted directly via Customer Portal</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            {/* Category Badge */}
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${categoryTheme.badgeClass}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${categoryTheme.dot}`} />
              <Tag size={11} />
              <span>{feedbackCategory}</span>
            </span>

            {submitterEmail && (
              <div className="flex items-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-1 border border-slate-200/60 font-medium">
                <Mail size={13} className="text-slate-400" />
                <span>{submitterEmail}</span>
              </div>
            )}
            {dateStr && (
              <div className="flex items-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-1 border border-slate-200/60 font-medium">
                <Calendar size={13} className="text-slate-400" />
                <span>{dateStr}</span>
              </div>
            )}
            {feedback.status && (
              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-semibold">
                {feedback.status}
              </Badge>
            )}
          </div>
        </div>

        {/* Raw Customer Text Block */}
        <div className="relative rounded-xl bg-slate-900 p-4 text-sm text-slate-100 leading-relaxed font-sans border border-slate-800 shadow-inner">
          <Quote size={24} className="absolute right-3 top-3 text-slate-800 pointer-events-none" />
          <p className="whitespace-pre-wrap relative z-10 text-xs sm:text-sm">
            {feedback.rawContent || feedback.content || 'No text content available'}
          </p>
        </div>

        {/* Attachment preview if present */}
        {feedback.screenshotUrl && (
          <div className="flex items-center gap-2 rounded-lg bg-indigo-50/50 p-2.5 border border-indigo-100 text-xs">
            <span className="font-semibold text-indigo-900">Attached Media:</span>
            <a
              href={feedback.screenshotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:underline"
            >
              <span>View attached screenshot</span>
              <ExternalLink size={12} />
            </a>
          </div>
        )}
      </Card>

      {/* Extracted AI Tasks Section Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-bold shadow-2xs">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Extracted AI Sub-Tasks</h3>
                <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 font-mono text-xs font-bold text-indigo-800">
                  {totalSubTasks} {totalSubTasks === 1 ? 'Task' : 'Tasks'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Decomposed sub-tasks extracted from this customer feedback item.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Strictly View-Only</span>
          </div>
        </div>

        {/* Task Cards List with Pagination */}
        {totalSubTasks === 0 ? (
          <Card className="py-12 border-dashed border-slate-200 bg-white text-center shadow-xs rounded-2xl">
            <EmptyState
              icon={Layers}
              title="No tasks extracted"
              description="The AI did not extract any distinct sub-tasks from this feedback submission."
            />
          </Card>
        ) : (
          <div className="flex flex-col gap-3.5">
            {paginatedTasks.map((task, index) => {
              const globalIndex = (subTaskPage - 1) * subTaskPageSize + index
              return (
                <ExtractedTaskCard
                  key={task.id || globalIndex}
                  task={task}
                  index={globalIndex}
                  categoriesMap={categoriesMap}
                />
              )
            })}

            {totalSubTasks > subTaskPageSize && (
              <div className="px-4 py-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                <TablePagination
                  rangeStart={rangeStart}
                  rangeEnd={rangeEnd}
                  totalItems={totalSubTasks}
                  hasNextPage={hasNextSubPage}
                  hasPreviousPage={hasPrevSubPage}
                  onNext={() => setSubTaskPage((p) => p + 1)}
                  onPrevious={() => setSubTaskPage((p) => Math.max(p - 1, 1))}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
