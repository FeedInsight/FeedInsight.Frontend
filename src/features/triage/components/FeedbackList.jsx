import { useState } from 'react'
import Input from '@shared/components/ui/Input.jsx'
import Spinner from '@shared/components/ui/Spinner.jsx'
import EmptyState from '@shared/components/ui/EmptyState.jsx'
import FeedbackListItem from './FeedbackListItem.jsx'
import { useFeedbacks } from '@features/triage/hooks/useFeedbacks.js'
import { useDebounce } from '@shared/hooks/useDebounce.js'
import { Inbox } from 'lucide-react'

/**
 * List panel for the AI Triage Inbox workspace.
 * Debounces search queries and renders selectable feedback items.
 */
export default function FeedbackList({ selectedId, onSelectFeedback }) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const { data: feedbacks = [], isLoading } = useFeedbacks({ search: debouncedSearch })

  const items = Array.isArray(feedbacks)
    ? feedbacks
    : Array.isArray(feedbacks?.items)
    ? feedbacks.items
    : Array.isArray(feedbacks?.data)
    ? feedbacks.data
    : Array.isArray(feedbacks?.$values)
    ? feedbacks.$values
    : []

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-900">Inbox</h2>
        <Input
          placeholder="Search feedback…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-48 sm:w-60"
        />
      </div>

      {isLoading ? (
        <div className="flex py-12 justify-center">
          <Spinner size={24} />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No feedback found"
          description="Submissions from the customer portal will appear here for AI triage review."
        />
      ) : (
        <div className="flex flex-col gap-2.5 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
          {items.map((item) => (
            <FeedbackListItem
              key={item.id}
              item={item}
              isSelected={item.id === selectedId}
              onClick={() => onSelectFeedback(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
