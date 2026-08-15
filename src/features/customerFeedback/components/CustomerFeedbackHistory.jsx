import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '@shared/components/ui/Card.jsx'
import Button from '@shared/components/ui/Button.jsx'
import Spinner from '@shared/components/ui/Spinner.jsx'
import EmptyState from '@shared/components/ui/EmptyState.jsx'
import SearchBar from '@shared/components/ui/SearchBar.jsx'
import TablePagination from '@shared/components/ui/TablePagination.jsx'
import { formatDateTime, formatRelative } from '@shared/utils/formatDate.js'
import { useDevelopmentCustomerFeedbacks } from '../hooks/useCustomerFeedback.js'
import { useUnseenResponses } from '../hooks/useUnseenResponses.js'
import { usePagination } from '@shared/hooks/usePagination.js'
import { useDebounce } from '@shared/hooks/useDebounce.js'
import { normalizeFeedbackList, extractTotalCount } from '../utils/feedbackNormalizer.js'
import { ROUTES } from '@router/routes.js'
import {
  ChevronDown,
  ChevronUp,
  MessageSquare,
  MessagesSquare,
  ShieldCheck,
  Plus,
  Clock,
  Mail,
  Filter,
  Calendar,
  MessageCircle,
  Bell,
  CheckCircle2,
  Sparkles,
  Tag,
} from 'lucide-react'
import { getCategoryTheme, resolveCategoryName } from '@shared/utils/categoryColors.js'

export default function CustomerFeedbackHistory() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 250)
  const [responseFilter, setResponseFilter] = useState('all') // 'all' | 'unread' | 'responded' | 'waiting'
  const [expandedIds, setExpandedIds] = useState({})

  const { page, pageSize, setPage, nextPage, prevPage } = usePagination(10)
  const { data, isLoading, isFetching, isError, error } = useDevelopmentCustomerFeedbacks({
    page,
    pageSize,
  })

  // Normalize all incoming items and their product owner comments
  const items = useMemo(() => normalizeFeedbackList(data), [data])
  const totalItems = useMemo(() => extractTotalCount(data, items.length), [data, items.length])

  // Hook for tracking unseen product owner responses
  const {
    markAsSeen,
    markAllAsSeen,
    hasUnseen,
    getUnseenCount,
    totalUnseenCount,
  } = useUnseenResponses(items)

  // Total count of official comments
  const totalResponsesCount = useMemo(() => {
    return items.reduce((acc, curr) => acc + (curr.comments?.length || 0), 0)
  }, [items])

  // Count items with unread responses
  const unreadItemsCount = useMemo(() => {
    return items.filter((item) => hasUnseen(item.id, item.comments?.length || 0)).length
  }, [items, hasUnseen])

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search filter
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase()
        const matchTitle = (item.title || '').toLowerCase().includes(q)
        const matchContent = (item.content || '').toLowerCase().includes(q)
        const matchComments = item.comments?.some((c) =>
          (c.content || '').toLowerCase().includes(q),
        )
        if (!matchTitle && !matchContent && !matchComments) {
          return false
        }
      }

      const commentsCount = item.comments?.length || 0
      const isUnread = hasUnseen(item.id, commentsCount)

      // Response status filter
      if (responseFilter === 'unread' && !isUnread) {
        return false
      }
      if (responseFilter === 'responded' && commentsCount === 0) {
        return false
      }
      if (responseFilter === 'waiting' && commentsCount > 0) {
        return false
      }

      return true
    })
  }, [items, debouncedSearch, responseFilter, hasUnseen])

  const toggleExpand = (item) => {
    const isCurrentlyExpanded = expandedIds[item.id] !== undefined ? expandedIds[item.id] : true
    const nextExpanded = !isCurrentlyExpanded

    setExpandedIds((prev) => ({
      ...prev,
      [item.id]: nextExpanded,
    }))

    // If opening details, mark comments as seen
    if (nextExpanded && item.comments?.length) {
      markAsSeen(item.id, item.comments.length)
    }
  }

  const toggleExpandAll = () => {
    const allExpanded = items.every((item) => expandedIds[item.id])
    const nextState = {}
    items.forEach((item) => {
      nextState[item.id] = !allExpanded
      if (!allExpanded && item.comments?.length) {
        markAsSeen(item.id, item.comments.length)
      }
    })
    setExpandedIds(nextState)
  }

  const hasNextPage = page * pageSize < totalItems
  const hasPreviousPage = page > 1
  const rangeStart = items.length > 0 ? (page - 1) * pageSize + 1 : 0
  const rangeEnd = Math.min((page - 1) * pageSize + items.length, totalItems)

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-16 shadow-xs text-center">
        <div className="flex flex-col items-center justify-center gap-3 text-slate-500 text-sm">
          <Spinner size={32} className="text-brand-600" />
          <span className="font-medium">Loading your feedback submissions...</span>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-6 text-sm text-rose-700">
        <p className="font-bold text-base">Unable to load your feedback history.</p>
        <p className="text-xs text-rose-600 mt-1">{error?.message || 'Please try again later.'}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Total Submissions */}
        <div className="flex items-center gap-3.5 rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
            <MessagesSquare size={20} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">My Submissions</span>
            <div className="text-xl font-bold text-slate-900">{totalItems}</div>
          </div>
        </div>

        {/* Metric 2: Official Responses */}
        <div className="flex items-center gap-3.5 rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <MessageCircle size={20} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Official Responses</span>
            <div className="text-xl font-bold text-indigo-700">{totalResponsesCount}</div>
          </div>
        </div>

        {/* Metric 3: New / Unread Responses */}
        <div
          className={`flex items-center gap-3.5 rounded-2xl p-4 border shadow-xs transition-all ${
            totalUnseenCount > 0
              ? 'bg-amber-50/70 border-amber-200/90 ring-1 ring-amber-200/50'
              : 'bg-white border-slate-200/80'
          }`}
        >
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
              totalUnseenCount > 0
                ? 'bg-amber-100 text-amber-700 border-amber-300'
                : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            <Bell size={20} className={totalUnseenCount > 0 ? 'animate-bounce' : ''} />
          </div>
          <div className="flex-1">
            <span className="text-xs font-semibold text-slate-500">Unread Responses</span>
            <div
              className={`text-xl font-bold ${
                totalUnseenCount > 0 ? 'text-amber-700' : 'text-slate-900'
              }`}
            >
              {totalUnseenCount}
            </div>
          </div>
          {totalUnseenCount > 0 && (
            <button
              type="button"
              onClick={() => markAllAsSeen(items)}
              className="text-[11px] font-bold text-amber-800 hover:text-amber-900 underline shrink-0"
              title="Mark all as read"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Unread Response Notification Banner (if any unseen responses exist) */}
      {totalUnseenCount > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-indigo-500/10 border border-amber-300/80 p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs shrink-0">
              <Bell size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                You have {totalUnseenCount} new official {totalUnseenCount === 1 ? 'response' : 'responses'}!
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                The product team has replied to your feedback tickets.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setResponseFilter('unread')}
              className="text-xs font-bold border-amber-300 text-amber-900 hover:bg-amber-100/60"
            >
              View New Responses
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => markAllAsSeen(items)}
              className="text-xs"
            >
              Mark all as read
            </Button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search your feedback or team replies..."
          />
          {isFetching && <Spinner className="text-brand-600" size={18} />}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Response Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setResponseFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                responseFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({items.length})
            </button>

            {unreadItemsCount > 0 && (
              <button
                type="button"
                onClick={() => setResponseFilter('unread')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  responseFilter === 'unread'
                    ? 'bg-amber-500 text-white shadow-xs font-bold'
                    : 'text-amber-700 hover:bg-amber-100/60 font-semibold'
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                <span>New Responses ({unreadItemsCount})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setResponseFilter('responded')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                responseFilter === 'responded'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Responded ({items.filter((i) => i.comments?.length > 0).length})
            </button>

            <button
              type="button"
              onClick={() => setResponseFilter('waiting')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                responseFilter === 'waiting'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Waiting ({items.filter((i) => !i.comments || i.comments.length === 0).length})
            </button>
          </div>

          {/* Toggle Expand All */}
          {items.length > 0 && (
            <button
              type="button"
              onClick={toggleExpandAll}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              Expand / Collapse All
            </button>
          )}
        </div>
      </div>

      {/* Main Feedback List */}
      {items.length === 0 ? (
        <Card className="py-16 border-dashed text-center bg-white rounded-2xl shadow-xs">
          <EmptyState
            icon={MessageSquare}
            title="No feedback submitted yet"
            description="You haven't submitted any feedback tickets yet. Share your suggestions, ideas, or questions directly with our engineering team."
          />
          <div className="mt-6 flex justify-center">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => navigate(ROUTES.customerSubmitFeedback)}
              className="shadow-md shadow-brand-500/20"
            >
              <Plus size={16} />
              <span>Submit Your First Feedback</span>
            </Button>
          </div>
        </Card>
      ) : filteredItems.length === 0 ? (
        <Card className="py-12 border-dashed text-center bg-white rounded-2xl shadow-xs">
          <EmptyState
            icon={Filter}
            title="No matching feedback"
            description="No feedback submissions match your search query or selected filter."
          />
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setSearchTerm('')
                setResponseFilter('all')
              }}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 underline"
            >
              Reset filters
            </button>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredItems.map((item) => {
            const commentsCount = item.comments?.length || 0
            const hasComments = commentsCount > 0
            const isUnread = hasUnseen(item.id, commentsCount)
            const unseenItemCount = getUnseenCount(item.id, commentsCount)

            // Default to expanded if it has comments or if explicitly expanded
            const isExpanded = expandedIds[item.id] !== undefined ? expandedIds[item.id] : true

            const categoryName = resolveCategoryName(item)
            const categoryTheme = getCategoryTheme(categoryName)

            return (
              <Card
                key={item.id}
                className={`flex flex-col gap-4 border bg-white p-5 sm:p-6 shadow-xs rounded-2xl transition-all ${
                  isUnread
                    ? 'border-amber-300 ring-2 ring-amber-100 hover:border-amber-400'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {/* Header: Title & Badges */}
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h3>

                      {/* Unread Response Notification Badge */}
                      {isUnread && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-white shadow-xs animate-pulse">
                          <Bell size={12} />
                          <span>
                            {unseenItemCount > 1 ? `${unseenItemCount} New Responses` : 'New Response'}
                          </span>
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

                      {/* Clean Official Response Number / Status Pill */}
                      {hasComments ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-200 shadow-2xs">
                          <ShieldCheck size={13} className="text-indigo-600" />
                          <span>
                            {commentsCount}{' '}
                            {commentsCount === 1 ? 'Official Response' : 'Official Responses'}
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 border border-slate-200">
                          <Clock size={12} className="text-slate-400" />
                          <span>Awaiting Team Review</span>
                        </span>
                      )}
                    </div>

                    {/* Meta Info Row */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      {item.submittedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{formatDateTime(item.submittedAt)}</span>
                          <span>({formatRelative(item.submittedAt)})</span>
                        </span>
                      )}

                      {item.submitterEmail && (
                        <span className="flex items-center gap-1 text-slate-500">
                          <Mail size={12} />
                          <span>{item.submitterEmail}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleExpand(item)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shrink-0 self-start"
                  >
                    <span>{isExpanded ? 'Hide Details' : 'View Full Details'}</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                {/* Feedback Body Content */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Your Feedback Submission
                  </span>
                  <div className="rounded-xl bg-slate-50/90 p-4 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans border border-slate-200/70 whitespace-pre-wrap">
                    {item.content}
                  </div>
                </div>

                {/* Expanded Section: Product Team Responses */}
                {isExpanded && (
                  <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 mt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                        <MessageCircle size={15} className="text-indigo-600" />
                        <span>Product Team Responses ({commentsCount})</span>
                      </span>

                      {isUnread && (
                        <button
                          type="button"
                          onClick={() => markAsSeen(item.id, commentsCount)}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline"
                        >
                          Mark as seen
                        </button>
                      )}
                    </div>

                    {!hasComments ? (
                      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/40 p-4 text-center text-xs text-slate-500 flex flex-col items-center gap-1.5">
                        <Clock size={16} className="text-slate-400" />
                        <span className="font-semibold text-slate-700">No responses posted yet.</span>
                        <span className="text-slate-400">
                          The product team has received your submission and will post updates directly here.
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {item.comments.map((comment, idx) => {
                          const isPO = comment.isProductOwner || comment.role === 'ProductOwner'
                          return (
                            <div
                              key={comment.id || idx}
                              className="flex flex-col gap-2 rounded-xl p-4 text-xs sm:text-sm border bg-gradient-to-r from-indigo-50/90 to-blue-50/50 border-indigo-200/80 text-indigo-950 shadow-xs ring-1 ring-indigo-200/40"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100/80 pb-2">
                                <div className="flex items-center gap-2">
                                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white shadow-2xs">
                                    <ShieldCheck size={14} />
                                  </div>
                                  <span className="font-bold text-indigo-950 text-xs sm:text-sm">
                                    {comment.author || 'Product Team'}
                                  </span>
                                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800 border border-indigo-200">
                                    Product Owner Response
                                  </span>
                                </div>

                                {comment.createdAt && (
                                  <div className="flex items-center gap-1 text-[11px] text-indigo-600 font-medium">
                                    <Calendar size={11} />
                                    <span>{formatDateTime(comment.createdAt)}</span>
                                    <span>({formatRelative(comment.createdAt)})</span>
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
                    )}
                  </div>
                )}
              </Card>
            )
          })}

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="px-4 py-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
              <TablePagination
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                totalItems={totalItems}
                hasNextPage={hasNextPage}
                hasPreviousPage={hasPreviousPage}
                onNext={nextPage}
                onPrevious={prevPage}
                isLoading={isLoading || isFetching}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
