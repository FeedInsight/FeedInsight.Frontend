import { useState, useMemo } from 'react'
import Input from '@shared/components/ui/Input.jsx'
import Spinner from '@shared/components/ui/Spinner.jsx'
import EmptyState from '@shared/components/ui/EmptyState.jsx'
import FeedbackListItem from './FeedbackListItem.jsx'
import { useFeedbacks } from '@features/triage/hooks/useFeedbacks.js'
import { useDebounce } from '@shared/hooks/useDebounce.js'
import { Inbox } from 'lucide-react'

/**
 * List panel for the AI Triage Inbox workspace.
 * Debounces search queries, sorts items in descending order of highest task count, and renders selectable items.
 */
export default function FeedbackList({ selectedId, onSelectFeedback }) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const { data: feedbacks = [], isLoading } = useFeedbacks({ search: debouncedSearch })

  // Sort triage feedback items by highest task count first
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
      return bCount - aCount
    })
  }, [feedbacks])

  return (
    <div className="flex flex-col gap-4">
      {/* Header & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
            <Inbox size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Incoming Feedbacks</h2>
            <p className="text-[11px] text-slate-500">Sorted by highest task count ({sortedItems.length})</p>
          </div>
        </div>

        <Input
          placeholder="Search feedback..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-52 text-xs"
        />
      </div>

      {/* Content List */}
      {isLoading ? (
        <div className="flex py-16 justify-center items-center gap-2 text-slate-500 text-xs">
          <Spinner size={24} />
          <span>Loading triage inbox...</span>
        </div>
      ) : sortedItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
          <EmptyState
            icon={Inbox}
            title="No feedback found"
            description="Submissions from the customer portal will appear here for AI triage review."
          />
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
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
