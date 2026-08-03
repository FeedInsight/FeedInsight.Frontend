import Card from '@shared/components/ui/Card.jsx'
import Badge from '@shared/components/ui/Badge.jsx'
import Spinner from '@shared/components/ui/Spinner.jsx'
import EmptyState from '@shared/components/ui/EmptyState.jsx'
import ExtractedTaskCard from './ExtractedTaskCard.jsx'
import { useFeedbackDetail } from '@features/triage/hooks/useFeedbacks.js'
import { formatDateTime } from '@shared/utils/formatDate.js'
import { MessageSquareText, Layers, Mail, Calendar } from 'lucide-react'

/**
 * Read-only detail workspace for selected feedback item in the AI Triage Inbox.
 * Displays the original customer feedback content alongside all extracted AI tasks.
 */
export default function TriageDetailWorkspace({ feedbackId }) {
  const { data: feedback, isLoading, isError } = useFeedbackDetail(feedbackId)

  if (!feedbackId) {
    return (
      <Card className="flex h-full flex-col items-center justify-center p-8 text-center">
        <EmptyState
          icon={MessageSquareText}
          title="Select a feedback item"
          description="Choose a customer feedback submission from the triage inbox to inspect its extracted AI tasks."
        />
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="flex h-full min-h-[300px] items-center justify-center">
        <Spinner size={32} />
      </Card>
    )
  }

  if (isError || !feedback) {
    return (
      <Card className="flex h-full flex-col items-center justify-center p-8 text-center">
        <EmptyState
          icon={MessageSquareText}
          title="Feedback not found"
          description="Could not load details for the selected feedback item."
        />
      </Card>
    )
  }

  const rawTasks = feedback?.extractedTasks ?? feedback?.tasks ?? feedback?.$values
  const extractedTasks = Array.isArray(rawTasks)
    ? rawTasks
    : Array.isArray(rawTasks?.items)
    ? rawTasks.items
    : []
  const submitterEmail = feedback.submitterEmail || feedback.email || 'Anonymous'
  const dateStr = formatDateTime(feedback.createdAt || feedback.submissionDate)

  return (
    <div className="flex flex-col gap-6">
      {/* Original Customer Feedback Panel */}
      <Card className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">Original Feedback</h2>
            {feedback.status && (
              <Badge className="bg-brand-50 text-brand-700">
                {feedback.status}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Mail size={13} />
              <span>{submitterEmail}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={13} />
              <span>{dateStr}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-wrap border border-slate-200/60">
          {feedback.rawContent || feedback.content || 'No content available'}
        </div>

        {feedback.screenshotUrl && (
          <div className="mt-2 flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-500">Attachment</span>
            <a
              href={feedback.screenshotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-brand-600 hover:underline"
            >
              View attached screenshot
            </a>
          </div>
        )}
      </Card>

      {/* Extracted AI Tasks Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-brand-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              Extracted AI Tasks ({extractedTasks.length})
            </h3>
          </div>
          <Badge className="bg-slate-100 text-slate-600">Read-only view</Badge>
        </div>

        {extractedTasks.length === 0 ? (
          <Card className="py-8">
            <EmptyState
              icon={Layers}
              title="No tasks extracted"
              description="No AI tasks were extracted from this feedback submission."
            />
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {extractedTasks.map((task, index) => (
              <ExtractedTaskCard key={task.id || index} task={task} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
