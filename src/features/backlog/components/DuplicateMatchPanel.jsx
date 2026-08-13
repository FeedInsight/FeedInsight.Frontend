import { Link2 } from 'lucide-react'
import Card from '@shared/components/ui/Card.jsx'
import EmptyState from '@shared/components/ui/EmptyState.jsx'
import Spinner from '@shared/components/ui/Spinner.jsx'
import { useStoryDuplicates } from '@features/backlog/hooks/useStoryDetail.js'

export default function DuplicateMatchPanel({ storyId }) {
  const { data: duplicates = [], isLoading } = useStoryDuplicates(storyId)

  if (isLoading) return <Spinner />

  return (
    <Card>
      <h3 className="mb-3 text-sm font-semibold text-slate-700">Possible Duplicates</h3>
      {duplicates.length === 0 ? (
        <EmptyState icon={Link2} title="No similar stories found" />
      ) : (
        <ul className="flex flex-col gap-2">
          {duplicates.map((match) => (
            <li key={match.userStoryId} className="flex items-center justify-between text-sm">
              <span className="text-slate-700">{match.title}</span>
              <span className="text-xs font-medium text-slate-400">
                {Math.round(match.similarityScore * 100)}% match
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
