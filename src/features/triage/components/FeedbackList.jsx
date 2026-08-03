import { useState, useMemo } from 'react'
import Input from '@shared/components/ui/Input.jsx'
import Spinner from '@shared/components/ui/Spinner.jsx'
import EmptyState from '@shared/components/ui/EmptyState.jsx'
import FeedbackListItem from './FeedbackListItem.jsx'
import { useFeedbacks } from '@features/triage/hooks/useFeedbacks.js'
import { useDebounce } from '@shared/hooks/useDebounce.js'
import { Inbox, ArrowDownNarrowWide, Search } from 'lucide-react'

/**
 * List panel for the AI Triage Inbox workspace.
 * Debounces search queries, sorts items in descending order of highest extracted task count / feedback needed, and renders selectable items.
 * Strictly Read-Only PO Review interface.
 */
export default function FeedbackList({ selectedId, onSelectFeedback, isCompact = false }) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const { data: feedbacks = [], isLoading } = useFeedbacks({ search: debouncedSearch })

  // Sort triage feedback items by highest task count first, then by date
  const sortedItems = useMemo(() => {
    const rawItems = Array.isArray(feedbacks)
      ? feedbacks
      : Array.isArray(feedbacks?.items)
      ? feedbacks.items
      : Array.isArray(feedbacks?.data)
      ? feedbacks.data
      : Array.isArray(feedbacks?.$values)
      ? feedbacks.$values
      : []

    return [...rawItems].sort((a, b) => {
      const aTasks = a.extractedTasks ?? a.tasks ?? a.$values
      const bTasks = b.extractedTasks ?? b.tasks ?? b.$values
      const aCount =
        a.tasksCount ??
        a.extractedTasksCount ??
        (Array.isArray(aTasks) ? aTasks.length : Array.isArray(aTasks?.items) ? aTasks.items.length : 0)
      const bCount =
        b.tasksCount ??
        b.extractedTasksCount ??
        (Array.isArray(bTasks) ? bTasks.length : Array.isArray(bTasks?.items) ? bTasks.items.length : 0)

      if (bCount !== aCount) {
        return bCount - aCount
      }

      const aDate = new Date(a.createdAt || a.submissionDate || 0).getTime()
      const bDate = new Date(b.createdAt || b.submissionDate || 0).getTime()
      return bDate - aDate
    })
  }, [feedbacks])

  return (
    <div className="flex flex-col gap-4">
      {/* Header & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Inbox size={19} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Incoming Feedbacks</h2>
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
              <ArrowDownNarrowWide size={12} className="text-indigo-600 shrink-0" />
              <span>Sorted by highest task count ({sortedItems.length})</span>
            </div>
          </div>
        </div>

        <div className="relative w-full sm:w-60">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Search feedback content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 text-xs bg-slate-50/70 border-slate-200 focus:bg-white"
          />
        </div>
      </div>

      {/* Content List */}
      {isLoading ? (
        <div className="flex py-20 justify-center items-center gap-2.5 text-slate-500 text-xs">
          <Spinner size={24} />
          <span>Loading triage inbox...</span>
        </div>
      ) : sortedItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
          <EmptyState
            icon={Inbox}
            title="No feedback found"
            description="Submissions from the customer portal will appear here for AI triage review."
          />
        </div>
      ) : (
        <div
          className={
            isCompact
              ? 'flex flex-col gap-3 max-h-[calc(100vh-230px)] overflow-y-auto pr-1'
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[calc(100vh-230px)] overflow-y-auto pr-1'
          }
        >
          {sortedItems.map((item) => (
            <FeedbackListItem
              key={item.id}
              item={item}
              isSelected={String(item.id) === String(selectedId)}
              onClick={() => onSelectFeedback(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

