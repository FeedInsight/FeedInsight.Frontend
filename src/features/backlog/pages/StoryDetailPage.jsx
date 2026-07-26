import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Spinner from '@shared/components/ui/Spinner.jsx'
import Card from '@shared/components/ui/Card.jsx'
import AcceptanceCriteriaEditor from '@features/backlog/components/AcceptanceCriteriaEditor.jsx'
import DuplicateMatchPanel from '@features/backlog/components/DuplicateMatchPanel.jsx'
import ApprovalActions from '@features/backlog/components/ApprovalActions.jsx'
import { useStoryDetail } from '@features/backlog/hooks/useStoryDetail.js'

/**
 * Detail/review screen for a single draft UserStory. Holds the "edited
 * fields" state that AcceptanceCriteriaEditor writes into and
 * ApprovalActions reads from on Approve, so a reviewer's edits are included
 * in the approval payload without a controller-level form library (the
 * editor is simple enough not to need react-hook-form here).
 */
export default function StoryDetailPage() {
  const { storyId } = useParams()
  const { data: story, isLoading } = useStoryDetail(storyId)
  const [editedFields, setEditedFields] = useState(null)

  if (isLoading || !story) return <Spinner />

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-4 lg:col-span-2">
        <Card>
          <AcceptanceCriteriaEditor
            title={story.title}
            criteria={story.acceptanceCriteria}
            onChange={setEditedFields}
          />
        </Card>
        <Card>
          <ApprovalActions
            storyId={story.id}
            status={story.status}
            getEditedFields={() => editedFields ?? { title: story.title, acceptanceCriteria: story.acceptanceCriteria }}
          />
        </Card>
      </div>
      <div>
        <DuplicateMatchPanel storyId={story.id} />
      </div>
    </div>
  )
}
