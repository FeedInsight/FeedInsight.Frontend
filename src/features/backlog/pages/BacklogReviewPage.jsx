import { useState } from 'react'
import Input from '@shared/components/ui/Input.jsx'
import { useUserStories, useUserStoryMutations } from '@features/backlog/hooks/useUserStories.js'
import UserStoryTable from '@features/backlog/components/UserStoryTable.jsx'
import { ListChecks, Search } from 'lucide-react'

const initialFilters = {
  source: '',
  isSynced: '',
  searchTerm: '',
  pageNumber: 1,
  pageSize: 10,
}

const normalizeStories = (response) => {
  const payload = response?.data ?? response
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.$values)) return payload.$values
  return []
}

export default function BacklogReviewPage() {
  const [filters, setFilters] = useState(initialFilters)
  const { data: rawStories, isLoading } = useUserStories(filters)
  const { update, sync } = useUserStoryMutations()

  const stories = normalizeStories(rawStories)
  const totalItems = rawStories?.pagination?.totalItems ?? rawStories?.totalItems ?? stories.length
  const page = Number(filters.pageNumber || 1)
  const pageSize = Number(filters.pageSize || 10)

  const updateFilter = (field, value) => {
    setFilters((current) => ({
      ...current,
      [field]: value,
      ...(field !== 'pageNumber' && field !== 'pageSize' ? { pageNumber: 1 } : {}),
    }))
  }

  const handleEdit = ({ id, payload }) => {
    update.mutate(
      { id, payload },
      {
        onSuccess: () => {
          setFilters((current) => ({ ...current, pageNumber: 1 }))
        },
      },
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ListChecks className="w-6 h-6 text-brand-600" />
            Backlog Review
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Review user stories, filter by source and sync state, and trigger Jira synchronization.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">Source</label>
            <select
              value={filters.source}
              onChange={(e) => updateFilter('source', e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <option value="">All</option>
              <option value="FeedInsight">FeedInsight</option>
              <option value="Jira">Jira</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">Sync State</label>
            <select
              value={filters.isSynced}
              onChange={(e) => updateFilter('isSynced', e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <option value="">All</option>
              <option value="true">Synced</option>
              <option value="false">Not synced</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">Search</label>
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                value={filters.searchTerm}
                onChange={(e) => updateFilter('searchTerm', e.target.value)}
                placeholder="Search title or acceptance criteria"
                className="w-full pl-8"
              />
            </div>
          </div>
        </div>
      </div>

      <UserStoryTable
        rows={stories}
        isLoading={isLoading}
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={(nextPage) => setFilters((current) => ({ ...current, pageNumber: nextPage }))}
        onEdit={handleEdit}
        onSync={(storyId) => sync.mutate(storyId)}
        isSyncingId={sync.isPending ? sync.variables : null}
        isEditingId={update.isPending ? update.variables?.id : null}
      />
    </div>
  )
}
