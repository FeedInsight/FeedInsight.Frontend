import { useState } from 'react'
import Textarea from '@shared/components/ui/Textarea.jsx'
import Input from '@shared/components/ui/Input.jsx'

/**
 * Editable view of the AI-drafted title + Given-When-Then
 * AcceptanceCriteria before a reviewer approves. Lifts its edited values up
 * via onChange so the parent (StoryDetailPage) can pass them into
 * approveStory's payload -- this component holds no mutation logic itself.
 *
 * `criteria` is expected as a single formatted string (Given/When/Then
 * lines) matching UserStories.AcceptanceCriteria's NVARCHAR column; if the
 * backend later structures this as an array of clauses, update the parsing
 * here rather than changing the DB contract assumption elsewhere.
 */
export default function AcceptanceCriteriaEditor({ title, criteria, onChange }) {
  const [localTitle, setLocalTitle] = useState(title)
  const [localCriteria, setLocalCriteria] = useState(criteria)

  const emit = (nextTitle, nextCriteria) => onChange({ title: nextTitle, acceptanceCriteria: nextCriteria })

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Story title"
        value={localTitle}
        onChange={(e) => {
          setLocalTitle(e.target.value)
          emit(e.target.value, localCriteria)
        }}
      />
      <Textarea
        label="Acceptance criteria (Given / When / Then)"
        rows={8}
        value={localCriteria}
        onChange={(e) => {
          setLocalCriteria(e.target.value)
          emit(localTitle, e.target.value)
        }}
      />
    </div>
  )
}
