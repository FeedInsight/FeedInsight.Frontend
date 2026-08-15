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
  Bell,
} from 'lucide-react'
import Card from '@shared/components/ui/Card.jsx'
import Badge from '@shared/components/ui/Badge.jsx'
import Button from '@shared/components/ui/Button.jsx'
import Textarea from '@shared/components/ui/Textarea.jsx'
import { formatDateTime, formatRelative } from '@shared/utils/formatDate.js'
import { getCategoryTheme, resolveCategoryName } from '@shared/utils/categoryColors.js'
import { useAddDevelopmentCompanyComment } from '../hooks/useCustomerFeedback.js'
import { normalizeFeedbackItem } from '../utils/feedbackNormalizer.js'

export default function CompanyFeedbackCard({
  feedback: rawFeedback,
  categoriesMap = {},
  isUnseen = false,
  onMarkSeen,
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [commentText, setCommentText] = useState('')
  const { mutate: addComment, isPending } = useAddDevelopmentCompanyComment()

  const feedback = normalizeFeedbackItem(rawFeedback) || rawFeedback

  const id = feedback.id
  const customerName = feedback.submitterName || 'Company Customer'
  const customerEmail = feedback.submitterEmail || ''
  const categoryName = resolveCategoryName(feedback, categoriesMap)
  const categoryTheme = getCategoryTheme(categoryName)
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

  const handleToggleExpand = () => {
    if (!isExpanded && onMarkSeen) {
      onMarkSeen(id)
    }
    setIsExpanded(!isExpanded)
  }

  const handlePostComment = (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    if (onMarkSeen) {
      onMarkSeen(id)
    }

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
    <Card
      onClick={() => onMarkSeen?.(id)}
      className={`flex flex-col gap-4 bg-white p-5 sm:p-6 shadow-xs rounded-2xl transition-all ${
        isUnseen
          ? 'border-amber-300 ring-2 ring-amber-100/90 hover:border-amber-400'
          : 'border border-slate-200/80 hover:border-slate-300'
      }`}
    >
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
          {/* Unseen Feedback Notification Badge */}
          {isUnseen && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-white shadow-xs animate-pulse">
              <Bell size={12} />
              <span>New Feedback</span>
            </span>
          )}

          {/* Category Badge (Only render when not General / Uncategorized) */}
          {categoryName &&
            categoryName.toLowerCase() !== 'general' &&
            categoryName.toLowerCase() !== 'uncategorized' && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${categoryTheme.badgeClass}`}
              >
                <Tag size={10} />
                <span>{categoryName}</span>
              </span>
            )}

          {/* Comments Count Badge */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-200/80">
            <MessageCircle size={11} className="text-indigo-600" />
            <span>
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </span>
          </span>

          {/* Date */}
          {dateStr && (
            <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
              <Calendar size={12} />
              <span>{formatDateTime(dateStr)}</span>
            </div>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleToggleExpand()
            }}
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
