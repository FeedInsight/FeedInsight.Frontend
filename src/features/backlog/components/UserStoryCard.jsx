import { Link } from 'react-router-dom'
import Card from '@shared/components/ui/Card.jsx'
import Badge from '@shared/components/ui/Badge.jsx'
import UrgencyBadge from './UrgencyBadge.jsx'
import { STORY_STATUS_META } from '@shared/constants/statusEnums.js'
import { formatRelative } from '@shared/utils/formatDate.js'

/**
 * Summary card for one draft UserStories row, rendered in a list by
 * BacklogReviewPage. Clicking navigates to StoryDetailPage (router param
 * :storyId) for the full Given-When-Then editor + duplicate matches.
 */
export default function UserStoryCard({ story }) {
  const statusMeta = STORY_STATUS_META[story.status]

  return (
    <Link to={`/admin/backlog/${story.id}`}>
      <Card className="flex items-center justify-between hover:border-brand-300">
        <div>
          <p className="font-medium text-slate-800">{story.title}</p>
          <p className="text-xs text-slate-400">{formatRelative(story.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          {statusMeta && <Badge className={statusMeta.badgeClass}>{statusMeta.label}</Badge>}
          <UrgencyBadge score={story.urgencyScore} />
        </div>
      </Card>
    </Link>
  )
}
