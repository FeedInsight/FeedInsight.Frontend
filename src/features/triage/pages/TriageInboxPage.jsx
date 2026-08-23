import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import FeedbackList from '@features/triage/components/FeedbackList.jsx'
import TriageDetailWorkspace from '@features/triage/components/TriageDetailWorkspace.jsx'
import { useFeedbacks } from '@features/triage/hooks/useFeedbacks.js'
import { useUnseenTriageFeedbacks } from '@features/triage/hooks/useUnseenTriageFeedbacks.js'
import Button from '@shared/components/ui/Button.jsx'
import { Inbox, Layers, Eye, Bell } from 'lucide-react'
import PageHeader from '@shared/components/ui/PageHeader'

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

  const { markAsSeen, markAllAsSeen, isUnseen, totalUnseenCount } = useUnseenTriageFeedbacks(items)

  useEffect(() => {
    if (feedbackId) {
      markAsSeen(feedbackId)
    }
  }, [feedbackId, markAsSeen])

  // Compute total extracted tasks count across all inbox feedback items (#96 requirement)
  const totalTasksCount = items.reduce((sum, item) => {
    const rawTasks = item.extractedTasks ?? item.tasks ?? item.$values
    const count =
      item.tasksCount ??
      item.extractedTasksCount ??
      (Array.isArray(rawTasks)
        ? rawTasks.length
        : Array.isArray(rawTasks?.items)
          ? rawTasks.items.length
          : 0)
    return sum + count
  }, 0)

  const handleSelectFeedback = (id) => {
    markAsSeen(id)
    navigate(`/workspace/triage/${id}`)
  }

  const handleDeselect = () => {
    navigate('/workspace/triage')
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="AI Triage Inbox"
        description="Inspect AI-extracted product tasks generated from incoming customer feedback submissions."
      >
        <div
          className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2 border shadow-2xs transition-colors ${totalUnseenCount > 0
            ? 'bg-amber-50/80 border-amber-300/80 text-amber-900 ring-2 ring-amber-100'
            : 'bg-white border-slate-200/80 dark:bg-slate-900 dark:border-slate-700'
            }`}
        >
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-lg shadow-2xs ${totalUnseenCount > 0
              ? 'bg-amber-500 text-white'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }`}
          >
            <Bell size={15} />
          </div>
          <div className="flex flex-col">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${totalUnseenCount > 0 ? 'text-amber-800' : 'text-slate-400'
                }`}
            >
              Unseen
            </span>
            <span
              className={`font-mono text-sm font-extrabold ${totalUnseenCount > 0 ? 'text-amber-900' : 'text-slate-900'
                }`}
            >
              {totalUnseenCount}
            </span>
          </div>
          {totalUnseenCount > 0 && (
            <button
              type="button"
              onClick={() => markAllAsSeen(items)}
              className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline shrink-0 ml-1"
              title="Mark all triage items as read"
            >
              Mark read
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 rounded-xl bg-white px-3.5 py-2 border border-slate-200/80 shadow-2xs dark:bg-slate-900 dark:border-slate-700">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <Inbox size={15} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Total
            </span>
            <span className="font-mono text-sm font-extrabold text-slate-900 dark:text-slate-100">
              {items.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 px-3.5 py-2 border border-indigo-200/80 shadow-2xs dark:from-indigo-950/70 dark:to-slate-800 dark:border-indigo-800">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-2xs">
            <Layers size={15} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
              Extracted Tasks
            </span>
            <span className="font-mono text-sm font-extrabold text-indigo-950 dark:text-indigo-100">
              {totalTasksCount}
            </span>
          </div>
        </div>
      </PageHeader>

      {totalUnseenCount > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-indigo-500/10 border border-amber-300/80 p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs shrink-0">
              <Bell size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                You have {totalUnseenCount} new unseen feedback{' '}
                {totalUnseenCount === 1 ? 'submission' : 'submissions'}!
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 dark:text-slate-300">
                Review incoming feedback submissions and inspect AI-extracted product tasks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => markAllAsSeen(items)}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 border-amber-200 bg-white"
            >
              Mark all read
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className={feedbackId ? 'lg:col-span-5' : 'lg:col-span-12'}>
          <FeedbackList
            selectedId={feedbackId}
            onSelectFeedback={handleSelectFeedback}
            isCompact={Boolean(feedbackId)}
            isUnseen={isUnseen}
          />
        </div>

        {feedbackId && (
          <div className="lg:col-span-7">
            <TriageDetailWorkspace feedbackId={feedbackId} onBack={handleDeselect} />
          </div>
        )}
      </div>
    </div>
  )
}
