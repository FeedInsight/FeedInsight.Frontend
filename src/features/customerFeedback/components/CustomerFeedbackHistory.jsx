import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '@shared/components/ui/Card.jsx'
import Badge from '@shared/components/ui/Badge.jsx'
import Button from '@shared/components/ui/Button.jsx'
import Spinner from '@shared/components/ui/Spinner.jsx'
import EmptyState from '@shared/components/ui/EmptyState.jsx'
import SearchBar from '@shared/components/ui/SearchBar.jsx'
import TablePagination from '@shared/components/ui/TablePagination.jsx'
import { formatDateTime, formatRelative } from '@shared/utils/formatDate.js'
import { getCategoryTheme } from '@shared/utils/categoryColors.js'
import { useDevelopmentCustomerFeedbacks } from '../hooks/useCustomerFeedback.js'
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
  Tag,
  Sparkles,
  Smile,
  Meh,
  Frown,
  Plus,
  Clock,
  Mail,
  Filter,
  CheckCircle2,
  Calendar,
  MessageCircle,
} from 'lucide-react'

function getSentimentBadge(sentiment) {
  if (!sentiment) return null
  const s = String(sentiment).toLowerCase()
  if (s.includes('pos')) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
        <Smile size={12} className="text-emerald-600" />
        <span>Positive</span>
      </span>
    )
  }
  if (s.includes('neg')) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
        <Frown size={12} className="text-rose-600" />
        <span>Negative</span>
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200">
      <Meh size={12} className="text-slate-500" />
      <span>Neutral</span>
    </span>
  )
}

export default function CustomerFeedbackHistory() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 250)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [responseFilter, setResponseFilter] = useState('all') // 'all' | 'responded' | 'waiting'
  const [expandedIds, setExpandedIds] = useState({})

  const { page, pageSize, setPage, nextPage, prevPage } = usePagination(10)
  const { data, isLoading, isFetching, isError, error } = useDevelopmentCustomerFeedbacks({
    page,
    pageSize,
  })

  // Normalize all incoming items and their product owner comments
  const items = useMemo(() => normalizeFeedbackList(data), [data])
  const totalItems = useMemo(() => extractTotalCount(data, items.length), [data, items.length])

  // Extract unique categories for filtering
  const availableCategories = useMemo(() => {
    const set = new Set()
    items.forEach((item) => {
      if (item.category && item.category !== 'General') {
        set.add(item.category)
      }
    })
    return Array.from(set)
  }, [items])

  // Count total product owner comments
  const totalResponsesCount = useMemo(() => {
    return items.reduce((acc, curr) => acc + (curr.comments?.length || 0), 0)
  }, [items])

  // Client-side filtering on current page
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search filter
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase()
        const matchTitle = (item.title || '').toLowerCase().includes(q)
        const matchContent = (item.content || '').toLowerCase().includes(q)
        const matchCategory = (item.category || '').toLowerCase().includes(q)
        const matchComments = item.comments?.some((c) =>
          (c.content || '').toLowerCase().includes(q),
        )
        if (!matchTitle && !matchContent && !matchCategory && !matchComments) {
          return false
        }
      }

      // Category filter
      if (selectedCategory !== 'all') {
        if (item.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false
        }
      }

      // Response filter
      if (responseFilter === 'responded' && (!item.comments || item.comments.length === 0)) {
        return false
      }
      if (responseFilter === 'waiting' && item.comments && item.comments.length > 0) {
        return false
      }

      return true
    })
  }, [items, debouncedSearch, selectedCategory, responseFilter])

  const toggleExpand = (id) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const toggleExpandAll = () => {
    const allExpanded = items.every((item) => expandedIds[item.id])
    const nextState = {}
    items.forEach((item) => {
      nextState[item.id] = !allExpanded
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
        <div className="flex items-center gap-3.5 rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
            <MessagesSquare size={20} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Feedbacks</span>
            <div className="text-xl font-bold text-slate-900">{totalItems}</div>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <MessageCircle size={20} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Official Responses</span>
            <div className="text-xl font-bold text-indigo-700">{totalResponsesCount}</div>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <Sparkles size={20} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">AI Triage Status</span>
            <div className="text-sm font-bold text-purple-700">Active & Automated</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search feedback, topic, or response comments..."
          />
          {isFetching && <Spinner className="text-brand-600" size={18} />}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Response Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setResponseFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                responseFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({items.length})
            </button>
            <button
              type="button"
              onClick={() => setResponseFilter('responded')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                responseFilter === 'responded'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Responded ({items.filter((i) => i.comments?.length > 0).length})
            </button>
            <button
              type="button"
              onClick={() => setResponseFilter('waiting')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                responseFilter === 'waiting'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
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
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
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
            description="You haven't submitted any feedback tickets yet. Share your thoughts, requests, or bug reports with our product team."
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
            description="No feedback submissions match your search or selected filters."
          />
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
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
            const hasComments = item.comments && item.comments.length > 0
            // Default to expanded if it has comments or if explicitly expanded
            const isExpanded = expandedIds[item.id] !== undefined ? expandedIds[item.id] : true
            const categoryTheme = getCategoryTheme(item.category)

            return (
              <Card
                key={item.id}
                className="flex flex-col gap-4 border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs rounded-2xl transition-all hover:border-slate-300"
              >
                {/* Header: Title & Badges */}
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h3>

                      {/* Category Badge */}
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${categoryTheme.badgeClass}`}
                      >
                        <Tag size={11} />
                        <span>{item.category}</span>
                      </span>

                      {/* Sentiment Badge */}
                      {getSentimentBadge(item.overallSentiment)}

                      {/* AI Processed Badge */}
                      {item.isProcessedByRouter && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 border border-purple-200">
                          <Sparkles size={11} className="text-purple-600" />
                          <span>AI Triage</span>
                        </span>
                      )}

                      {/* Official Response Status Pill */}
                      {hasComments ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 border border-indigo-200 shadow-2xs">
                          <ShieldCheck size={12} className="text-indigo-600" />
                          <span>
                            {item.comments.length}{' '}
                            {item.comments.length === 1 ? 'Response' : 'Responses'}
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 border border-amber-200/80">
                          <Clock size={11} className="text-amber-600" />
                          <span>Awaiting Review</span>
                        </span>
                      )}
                    </div>

                    {/* Meta info row */}
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
                    onClick={() => toggleExpand(item.id)}
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
                  <div className="rounded-xl bg-slate-50/80 p-4 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans border border-slate-200/70 whitespace-pre-wrap">
                    {item.content}
                  </div>
                </div>

                {/* Expanded Section: Product Owner Comments & Responses */}
                {isExpanded && (
                  <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 mt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <MessageCircle size={15} className="text-indigo-600" />
                        <span>Product Owner Responses & Discussion</span>
                      </span>
                      {hasComments && (
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                          {item.comments.length} official {item.comments.length === 1 ? 'response' : 'responses'}
                        </span>
                      )}
                    </div>

                    {!hasComments ? (
                      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/40 p-4 text-center text-xs text-slate-500 flex flex-col items-center gap-1.5">
                        <Clock size={16} className="text-slate-400" />
                        <span className="font-semibold text-slate-700">No responses posted yet.</span>
                        <span className="text-slate-400">
                          The product team has received your feedback and will post updates directly here.
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {item.comments.map((comment, idx) => {
                          const isPO = comment.isProductOwner || comment.role === 'ProductOwner'
                          return (
                            <div
                              key={comment.id || idx}
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
                                    {comment.author}
                                  </span>
                                  <Badge className="bg-indigo-100 text-indigo-800 text-[10px] px-2 py-0.5 font-bold border border-indigo-200">
                                    Official Product Team Response
                                  </Badge>
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
