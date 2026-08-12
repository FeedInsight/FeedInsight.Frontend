import { useState } from 'react'
import Card from '@shared/components/ui/Card.jsx'
import Badge from '@shared/components/ui/Badge.jsx'
import Spinner from '@shared/components/ui/Spinner.jsx'
import EmptyState from '@shared/components/ui/EmptyState.jsx'
import { formatDateTime, formatRelative } from '@shared/utils/formatDate.js'
import { useCustomerFeedbackHistory } from '@features/customerFeedback/hooks/useCustomerFeedback.js'
import { ChevronDown, ChevronUp, MessageSquare } from 'lucide-react'

function normalizeFeedbackItems(rawData) {
  const items = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.items)
      ? rawData.items
      : Array.isArray(rawData?.data)
        ? rawData.data
        : Array.isArray(rawData?.$values)
          ? rawData.$values
          : []

  return items.map((item) => ({
    id: item.id || item.feedbackId || item.customerFeedbackId || item.feedbackID || item.id,
    title: item.title || item.subject || item.summary || 'Untitled feedback',
    description:
      item.description || item.body || item.detail || item.content || 'No description provided',
    category:
      item.category ||
      item.categoryName ||
      item.category?.name ||
      item.categoryName ||
      'Uncategorized',
    status: item.status || item.feedbackStatus || item.state || null,
    submittedAt:
      item.createdAt || item.submissionDate || item.submittedAt || item.timestamp || null,
    comments: Array.isArray(item.comments)
      ? item.comments
      : Array.isArray(item.comments?.items)
        ? item.comments.items
        : Array.isArray(item.comments?.data)
          ? item.comments.data
          : Array.isArray(item.comments?.$values)
            ? item.comments.$values
            : [],
  }))
}

export default function CustomerFeedbackHistory() {
  const { data, isLoading, isError, error } = useCustomerFeedbackHistory()
  const [openIds, setOpenIds] = useState([])

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 text-slate-700">
          <Spinner size={24} className="text-brand-600" />
          <span>Loading your feedback history...</span>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/80 p-6 text-sm text-red-700">
        <p className="font-semibold">Unable to load your feedback history.</p>
        <p>{error?.message || 'Please try again later.'}</p>
      </div>
    )
  }

  const items = normalizeFeedbackItems(data)

  if (items.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No feedback submitted yet"
        description="Once you submit feedback, it will appear here along with company responses."
      />
    )
  }

  const toggleOpen = (id) => {
    setOpenIds((current) =>
      current.includes(id) ? current.filter((openId) => openId !== id) : [...current, id],
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isOpen = openIds.includes(item.id)
        return (
          <Card key={item.id} className="space-y-4 border-slate-200">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <Badge className="bg-slate-100 text-slate-700">{item.category}</Badge>
                  {item.status ? (
                    <Badge className="bg-indigo-50 text-indigo-700">{item.status}</Badge>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                  <span>{formatDateTime(item.submittedAt)}</span>
                  <span>{formatRelative(item.submittedAt)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleOpen(item.id)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-300"
              >
                <span>{isOpen ? 'Hide details' : 'View details'}</span>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {isOpen && (
              <div className="space-y-4 border-t border-slate-200 pt-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Description</h4>
                  <p className="mt-2 text-sm text-slate-700 whitespace-pre-line">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-900">Company comments</h4>
                  {item.comments.length === 0 ? (
                    <p className="text-sm text-slate-500">No responses yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {item.comments.map((comment, index) => (
                        <div
                          key={comment.id ?? index}
                          className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                        >
                          <p className="text-sm text-slate-700">
                            {comment.message ||
                              comment.text ||
                              comment.body ||
                              comment.comment ||
                              'Comment details unavailable.'}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                            {comment.author && <span>{comment.author}</span>}
                            <span>
                              {formatDateTime(
                                comment.createdAt || comment.timestamp || comment.date,
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
