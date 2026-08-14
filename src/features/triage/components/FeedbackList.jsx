import { useState, useMemo, useEffect } from 'react'
import Input from '@shared/components/ui/Input.jsx'
import Spinner from '@shared/components/ui/Spinner.jsx'
import EmptyState from '@shared/components/ui/EmptyState.jsx'
import FeedbackListItem from './FeedbackListItem.jsx'
import TablePagination from '@shared/components/ui/TablePagination.jsx'
import { useFeedbacks } from '@features/triage/hooks/useFeedbacks.js'
import { useCategories } from '@features/categories/hooks/useCategories.js'
import { useDebounce } from '@shared/hooks/useDebounce.js'
import { Inbox, ArrowDownNarrowWide, Search } from 'lucide-react'

/**
 * List panel for the AI Triage Inbox workspace.
 * Debounces search queries, paginates via GET /api/feedbacks (page, pageSize),
 * sorts items in descending order of highest extracted task count / feedback needed, and renders selectable items.
 * Strictly Read-Only PO Review interface.
 */
export default function FeedbackList({ selectedId, onSelectFeedback, isCompact = false }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const { data: feedbacksData, isLoading, isFetching } = useFeedbacks({
    search: debouncedSearch || undefined,
    page,
    pageSize,
  })

  // Load tenant categories to map categoryId -> categoryName
  const { data: rawCategories } = useCategories()
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

  // Normalize array and pagination metrics from API payload
  const { rawItems, totalItems, hasNextPage, hasPreviousPage } = useMemo(() => {
    if (!feedbacksData) return { rawItems: [], totalItems: 0, hasNextPage: false, hasPreviousPage: false }

    const items = Array.isArray(feedbacksData)
      ? feedbacksData
      : Array.isArray(feedbacksData?.items)
      ? feedbacksData.items
      : Array.isArray(feedbacksData?.data)
      ? feedbacksData.data
      : Array.isArray(feedbacksData?.$values)
      ? feedbacksData.$values
      : []

    const total =
      feedbacksData?.totalItems ??
      feedbacksData?.pagination?.totalItems ??
      feedbacksData?.totalCount ??
      items.length

    const hasNext = feedbacksData?.hasNextPage ?? feedbacksData?.pagination?.hasNextPage ?? (page * pageSize < total)
    const hasPrev = feedbacksData?.hasPreviousPage ?? feedbacksData?.pagination?.hasPreviousPage ?? (page > 1)

    return { rawItems: items, totalItems: total, hasNextPage: hasNext, hasPreviousPage: hasPrev }
  }, [feedbacksData, page, pageSize])

  // Sort triage feedback items by highest task count first, then by date
  const sortedItems = useMemo(() => {
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
  }, [rawItems])

  const rangeStart = sortedItems.length > 0 ? (page - 1) * pageSize + 1 : 0
  const rangeEnd = Math.min(page * pageSize, totalItems || sortedItems.length)

  return (
    <div className="flex flex-col gap-4">
      {/* Header & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/80 shadow-2xs">
            <Inbox size={19} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Incoming Feedbacks</h2>
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
              <ArrowDownNarrowWide size={12} className="text-indigo-600 shrink-0" />
              <span>Sorted by task count & page ({sortedItems.length})</span>
            </div>
          </div>
        </div>

        <div className="relative w-full sm:w-60">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Search feedback content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 text-xs bg-slate-50/70 border-slate-200 focus:bg-white rounded-xl"
          />
        </div>
      </div>

      {/* Content List */}
      {isLoading ? (
        <div className="flex py-20 justify-center items-center gap-2.5 text-slate-500 text-xs bg-white rounded-2xl border border-slate-200/80">
          <Spinner size={24} className="text-brand-600" />
          <span>Loading triage inbox...</span>
        </div>
      ) : sortedItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-xs">
          <EmptyState
            icon={Inbox}
            title="No feedback found"
            description="Submissions from the customer portal will appear here for AI triage review."
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div
            className={
              isCompact
                ? 'flex flex-col gap-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1'
                : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-1'
            }
          >
            {sortedItems.map((item) => (
              <FeedbackListItem
                key={item.id}
                item={item}
                categoriesMap={categoriesMap}
                isSelected={String(item.id) === String(selectedId)}
                onClick={() => onSelectFeedback(item.id)}
              />
            ))}
          </div>

          <div className="px-4 py-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <TablePagination
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              totalItems={totalItems}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              onNext={() => setPage((p) => p + 1)}
              onPrevious={() => setPage((p) => Math.max(p - 1, 1))}
              isLoading={isLoading || isFetching}
            />
          </div>
        </div>
      )}
    </div>
  )
}
