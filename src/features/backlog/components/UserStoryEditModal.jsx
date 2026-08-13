import { useEffect, useState } from 'react'
import Modal from '@shared/components/ui/Modal.jsx'
import Button from '@shared/components/ui/Button.jsx'
import Input from '@shared/components/ui/Input.jsx'
import Textarea from '@shared/components/ui/Textarea.jsx'

export default function UserStoryEditModal({ isOpen, onClose, story, onSave, isSubmitting }) {
  const [title, setTitle] = useState('')
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('')

  useEffect(() => {
    if (story) {
      setTitle(story.title || '')
      setAcceptanceCriteria(story.acceptanceCriteria || '')
    }
  }, [story])

  const handleSubmit = () => {
    if (!story) return
    onSave?.({
      id: story.id,
      payload: {
        title: title.trim(),
        acceptanceCriteria: acceptanceCriteria.trim(),
      },
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit user story" size="lg">
      <div className="space-y-4">
        <Input
          label="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Story title"
        />

        <Textarea
          label="Acceptance Criteria"
          rows={6}
          value={acceptanceCriteria}
          onChange={(event) => setAcceptanceCriteria(event.target.value)}
          placeholder="Acceptance criteria"
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isSubmitting} disabled={!title.trim() || !acceptanceCriteria.trim()}>
            Save changes
          </Button>
        </div>
      </div>
    </Modal>
  )
}
