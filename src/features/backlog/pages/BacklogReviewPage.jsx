import { useState } from 'react'
import Input from '@shared/components/ui/Input.jsx'
import Spinner from '@shared/components/ui/Spinner.jsx'
import EmptyState from '@shared/components/ui/EmptyState.jsx'
import UserStoryCard from '@features/backlog/components/UserStoryCard.jsx'
import TablePagination from '@shared/components/ui/TablePagination.jsx'
import { useDraftStories } from '@features/backlog/hooks/useDraftStories.js'
import { useDebounce } from '@shared/hooks/useDebounce.js'
import { ListChecks, Search } from 'lucide-react'

/**
 * "Backlog Review Workspace" list view. Search box
 * is debounced client-side before hitting useDraftStories.
 */
export default function BacklogReviewPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const debouncedSearch = useDebounce(search, 300)
  const { data: rawStories, isLoading } = useDraftStories({ search: debouncedSearch })

  const stories = Array.isArray(rawStories)
    ? rawStories
    : Array.isArray(rawStories?.items)
    ? rawStories.items
    : Array.isArray(rawStories?.data)
    ? rawStories.data
    : Array.isArray(rawStories?.$values)
    ? rawStories.$values
    : []

  const totalItems = stories.length
  const paginatedStories = stories.slice((page - 1) * pageSize, page * pageSize)
  const rangeStart = totalItems > 0 ? (page - 1) * pageSize + 1 : 0
  const rangeEnd = Math.min(page * pageSize, totalItems)
  const hasNextPage = page * pageSize < totalItems
  const hasPreviousPage = page > 1

  return (
    <div className="flex flex-col gap-6">
      {/* Executive Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ListChecks className="w-6 h-6 text-brand-600" />
            Backlog Review
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Inspect, refine, approve, or reject draft user stories generated from customer feedback triage.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Search draft stories..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full pl-8 text-xs bg-white border-slate-200 shadow-xs focus:bg-white rounded-xl"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20 bg-white rounded-2xl border border-slate-200/80">
          <Spinner size={24} className="text-brand-600" />
        </div>
      ) : stories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-xs">
          <EmptyState icon={ListChecks} title="No draft stories" description="Newly triaged feedback will appear here for review." />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3.5">
            {paginatedStories.map((story) => (
              <UserStoryCard key={story.id} story={story} />
            ))}
          </div>

          <div className="px-5 py-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <TablePagination
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              totalItems={totalItems}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              onNext={() => setPage((p) => p + 1)}
              onPrevious={() => setPage((p) => Math.max(p - 1, 1))}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  )
}

