import { useParams, useNavigate } from 'react-router-dom'
import FeedbackList from '@features/triage/components/FeedbackList.jsx'
import TriageDetailWorkspace from '@features/triage/components/TriageDetailWorkspace.jsx'
import { useFeedbacks } from '@features/triage/hooks/useFeedbacks.js'
import { Inbox, Layers } from 'lucide-react'

/**
 * Top-level page for the AI Triage Inbox & Task Review Workspace.
 * Composes a master-detail layout for reviewing customer feedback and its extracted AI tasks.
 * Satisfies Task #96, Task #98, and Task #101.
 */
export default function TriageInboxPage() {
  const { feedbackId } = useParams()
  const navigate = useNavigate()
  const { data: feedbacks = [] } = useFeedbacks()

  const items = Array.isArray(feedbacks)
    ? feedbacks
    : Array.isArray(feedbacks?.items)
    ? feedbacks.items
    : Array.isArray(feedbacks?.data)
    ? feedbacks.data
    : Array.isArray(feedbacks?.$values)
    ? feedbacks.$values
    : []

  // Compute total extracted tasks count across all inbox feedback items (#96 requirement)
  const totalTasksCount = items.reduce((sum, item) => {
    const rawTasks = item.extractedTasks ?? item.tasks ?? item.$values
    const count =
      item.tasksCount ??
      item.extractedTasksCount ??
      (Array.isArray(rawTasks) ? rawTasks.length : Array.isArray(rawTasks?.items) ? rawTasks.items.length : 0)
    return sum + count
  }, 0)

  const handleSelectFeedback = (id) => {
    navigate(`/workspace/triage/${id}`)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Executive Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">AI Triage Inbox</h1>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Monitor customer feedback submissions, inspect compound task splitting, category assignments, and technical keywords.
          </p>
        </div>

        {/* Summary Counter Metrics */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 border border-slate-200/80 shadow-2xs">
            <Inbox size={16} className="text-slate-400" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Submissions</span>
              <span className="font-mono text-sm font-extrabold text-slate-900">{items.length}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-indigo-50/80 px-3.5 py-2 border border-indigo-200/80 shadow-2xs">
            <Layers size={16} className="text-indigo-600" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Extracted Tasks</span>
              <span className="font-mono text-sm font-extrabold text-indigo-900">{totalTasksCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Master-Detail Grid */}
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
