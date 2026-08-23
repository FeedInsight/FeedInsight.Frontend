import { useMemo } from 'react'
import Modal from '@shared/components/ui/Modal.jsx'

export default function UserStoryDetailModal({ isOpen, onClose, story }) {
  const fields = useMemo(
    () => [
      { label: 'Title', value: story?.title || '—' },
      { label: 'Acceptance Criteria', value: story?.acceptanceCriteria || '—' },
      { label: 'Category Name', value: story?.categoryName || '—' },
      { label: 'Urgency Score', value: story?.urgencyScore ?? '—' },
      { label: 'Status', value: story?.status || '—' },
      { label: 'Source', value: story?.source || '—' },
      { label: 'Jira Ticket Key', value: story?.jiraTicketKey || '—' },
    ],
    [story],
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User story details" size="lg">
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.label} className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{field.label}</p>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 whitespace-pre-wrap">
              {field.value}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}
