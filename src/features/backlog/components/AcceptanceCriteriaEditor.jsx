import { useState } from 'react'
import Textarea from '@shared/components/ui/Textarea.jsx'
import Input from '@shared/components/ui/Input.jsx'

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
