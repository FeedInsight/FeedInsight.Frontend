import { useState } from 'react'
import {
  Send,
  Mail,
  Calendar,
  ShieldCheck,
  Tag,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Sparkles,
  Smile,
  Meh,
  Frown,
} from 'lucide-react'
import Card from '@shared/components/ui/Card.jsx'
import Badge from '@shared/components/ui/Badge.jsx'
import Button from '@shared/components/ui/Button.jsx'
import Textarea from '@shared/components/ui/Textarea.jsx'
import { formatDateTime, formatRelative } from '@shared/utils/formatDate.js'
import { getCategoryTheme } from '@shared/utils/categoryColors.js'
import { useAddDevelopmentCompanyComment } from '../hooks/useCustomerFeedback.js'
import { normalizeFeedbackItem } from '../utils/feedbackNormalizer.js'

function getSentimentBadge(sentiment) {
  if (!sentiment) return null
  const s = String(sentiment).toLowerCase()
  if (s.includes('pos')) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
        <Smile size={11} className="text-emerald-600" />
        <span>Positive</span>
      </span>
    )
  }
  if (s.includes('neg')) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
        <Frown size={11} className="text-rose-600" />
        <span>Negative</span>
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200">
      <Meh size={11} className="text-slate-500" />
      <span>Neutral</span>
    </span>
  )
}

export default function CompanyFeedbackCard({ feedback: rawFeedback }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [commentText, setCommentText] = useState('')
  const { mutate: addComment, isPending } = useAddDevelopmentCompanyComment()

  const feedback = normalizeFeedbackItem(rawFeedback) || rawFeedback

  const id = feedback.id
  const customerName = feedback.submitterName || 'Company Customer'
  const customerEmail = feedback.submitterEmail || ''
  const category = feedback.category || 'General'
  const categoryTheme = getCategoryTheme(category)
  const title = feedback.title || 'Customer Feedback'
  const rawContent = feedback.content || 'No content provided'
  const dateStr = feedback.submittedAt
  const comments = feedback.comments || []

  const getInitials = (name, email) => {
    if (name && name.trim()) {
      const parts = name.trim().split(' ')
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      return name.substring(0, 2).toUpperCase()
    }
    if (email) return email.substring(0, 2).toUpperCase()
    return 'CU'
  }

  const handlePostComment = (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    addComment(
      {
        feedbackId: id,
        content: commentText.trim(),
      },
      {
        onSuccess: () => {
          setCommentText('')
        },
      },
    )
  }

  return (
    <Card className="flex flex-col gap-4 border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs rounded-2xl transition-all">
      {/* Top Header: Customer Info & Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0 ring-2 ring-indigo-50">
            {getInitials(customerName, customerEmail)}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">{customerName}</span>
              <Badge className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5">
                Customer
              </Badge>
            </div>
            {customerEmail && (
              <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                <Mail size={12} />
                <span>{customerEmail}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Badge */}
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${categoryTheme.badgeClass}`}
          >
            <Tag size={10} />
            <span>{category}</span>
          </span>

          {/* Sentiment Badge */}
          {getSentimentBadge(feedback.overallSentiment)}

          {/* AI Processed Badge */}
          {feedback.isProcessedByRouter && (
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-semibold text-purple-700 border border-purple-200">
              <Sparkles size={10} className="text-purple-600" />
              <span>AI Processed</span>
            </span>
          )}

          {/* Status Badge */}
          {feedback.status && (
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-semibold text-xs">
              {feedback.status}
            </Badge>
          )}

          {/* Date */}
          {dateStr && (
            <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
              <Calendar size={12} />
              <span>{formatDateTime(dateStr)}</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors ml-1"
          >
            <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {/* Main Feedback Content */}
      <div className="flex flex-col gap-2">
        {title && title !== 'Customer Feedback' && (
          <h3 className="text-base font-bold text-slate-900 leading-snug">{title}</h3>
        )}

        <div className="rounded-xl bg-slate-900 p-4 text-xs sm:text-sm text-slate-100 leading-relaxed font-sans border border-slate-800 shadow-inner whitespace-pre-wrap">
          {rawContent}
        </div>
      </div>

      {/* Expandable Comments Section */}
      {isExpanded && (
        <div className="flex flex-col gap-4 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MessageCircle size={14} className="text-brand-600" />
              <span>Discussion & Responses ({comments.length})</span>
            </span>
            <span className="text-[11px] text-slate-400">
              Visible to customer and product team
            </span>
          </div>

          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
              {comments.map((comment, index) => {
                const isPO = comment.isProductOwner !== false
                const cDate = comment.createdAt

                return (
                  <div
                    key={comment.id ?? index}
                    className={`flex flex-col gap-2 rounded-xl p-4 text-xs sm:text-sm border transition-all ${
                      isPO
                        ? 'bg-gradient-to-r from-indigo-50/90 to-blue-50/60 border-indigo-200 text-indigo-950 shadow-xs ring-1 ring-indigo-200/50'
                        : 'bg-slate-50 border-slate-200/80 text-slate-800'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100/60 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white shadow-2xs">
                          <ShieldCheck size={14} />
                        </div>
                        <span className="font-bold text-indigo-900 text-xs sm:text-sm">
                          {comment.author || 'Product Owner'}
                        </span>
                        <Badge className="bg-indigo-100 text-indigo-800 text-[10px] px-2 py-0.5 font-bold border border-indigo-200">
                          Official Product Team Response
                        </Badge>
                      </div>

                      {cDate && (
                        <div className="flex items-center gap-1 text-[11px] text-indigo-600 font-medium">
                          <Calendar size={11} />
                          <span>{formatDateTime(cDate)}</span>
                          <span>({formatRelative(cDate)})</span>
                        </div>
                      )}
                    </div>

                    <p className="whitespace-pre-wrap leading-relaxed text-slate-800 font-sans pt-1">
                      {comment.content}
                    </p>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
              No comments posted yet for this customer feedback.
            </div>
          )}

          {/* Add Comment Form (Development Product Owner only) */}
          <form onSubmit={handlePostComment} className="flex flex-col gap-2.5 pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-700">
              Add Response / Comment as Product Owner:
            </span>
            <Textarea
              placeholder="Write an official response or update to this customer feedback..."
              rows={2}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={isPending}
              className="text-xs bg-slate-50/70 border-slate-200 focus:bg-white rounded-xl"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isPending}
                disabled={isPending || !commentText.trim()}
                className="shadow-xs px-4"
              >
                <Send size={13} />
                <span>{isPending ? 'Posting...' : 'Post Official Response'}</span>
              </Button>
            </div>
          </form>
        </div>
      )}
    </Card>
  )
}
