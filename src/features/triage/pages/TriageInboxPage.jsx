import { useParams, useNavigate } from 'react-router-dom'
import FeedbackList from '@features/triage/components/FeedbackList.jsx'
import TriageDetailWorkspace from '@features/triage/components/TriageDetailWorkspace.jsx'

/**
 * Top-level page for the AI Triage Inbox & Task Review Workspace (Sprint 2, Epic 3).
 * Composes a master-detail split layout for reviewing customer feedback and its extracted AI tasks.
 */
export default function TriageInboxPage() {
  const { feedbackId } = useParams()
  const navigate = useNavigate()

  const handleSelectFeedback = (id) => {
    navigate(`/workspace/triage/${id}`)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">AI Triage Inbox</h1>
          <p className="text-xs text-slate-500">
            Review customer feedback submissions and inspect AI-extracted product tasks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <FeedbackList
            selectedId={feedbackId}
            onSelectFeedback={handleSelectFeedback}
          />
        </div>

        <div className="lg:col-span-8">
          <TriageDetailWorkspace feedbackId={feedbackId} />
        </div>
      </div>
    </div>
  )
}
