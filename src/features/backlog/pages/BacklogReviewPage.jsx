import { useState } from 'react'
import Input from '@shared/components/ui/Input.jsx'
import Spinner from '@shared/components/ui/Spinner.jsx'
import EmptyState from '@shared/components/ui/EmptyState.jsx'
import UserStoryCard from '@features/backlog/components/UserStoryCard.jsx'
import { useDraftStories } from '@features/backlog/hooks/useDraftStories.js'
import { useDebounce } from '@shared/hooks/useDebounce.js'
import { ListChecks } from 'lucide-react'

/**
 * "Backlog Review Workspace" list view (README §Admin Portal). Search box
 * is debounced client-side before hitting useDraftStories so we don't spam
 * the API on every keystroke. Category filtering can be added the same way
 * once CategoriesPage data is wired to a <select> here.
 */
export default function BacklogReviewPage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Backlog Review</h1>
        <Input
          placeholder="Search draft stories…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
      </div>

      {isLoading ? (
        <Spinner />
      ) : stories.length === 0 ? (
        <EmptyState icon={ListChecks} title="No draft stories" description="Newly triaged feedback will appear here for review." />
      ) : (
        <div className="flex flex-col gap-3">
          {stories.map((story) => (
            <UserStoryCard key={story.id} story={story} />
          ))}
        </div>
      )}
    </div>
  )
}
