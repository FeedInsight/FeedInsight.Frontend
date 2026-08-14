import { useState, useMemo, useEffect } from 'react'
import { MessagesSquare, Search, MessageCircle, Users } from 'lucide-react'
import SearchBar from '@shared/components/ui/SearchBar.jsx'
import Spinner from '@shared/components/ui/Spinner.jsx'
import EmptyState from '@shared/components/ui/EmptyState.jsx'
import TablePagination from '@shared/components/ui/TablePagination.jsx'
import CompanyFeedbackCard from '../components/CompanyFeedbackCard.jsx'
import { useDevelopmentCompanyFeedbacks } from '../hooks/useCustomerFeedback.js'
import { useDebounce } from '@shared/hooks/useDebounce.js'
import { usePagination } from '@shared/hooks/usePagination.js'
import { normalizeFeedbackList, extractTotalCount } from '../utils/feedbackNormalizer.js'

export default function CompanyFeedbackDashboardPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 300)
  const { page, pageSize, params, setPage, nextPage, prevPage } = usePagination(10)

  const { data, isLoading, isFetching } = useDevelopmentCompanyFeedbacks({
    page: params.page,
    pageSize: params.pageSize,
  })

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, setPage])

  const rawItems = useMemo(() => {
    return normalizeFeedbackList(data)
  }, [data])

  const filteredItems = useMemo(() => {
    if (!debouncedSearch) return rawItems
    const q = debouncedSearch.toLowerCase()
    return rawItems.filter((item) => {
      const content = (item.content || '').toLowerCase()
      const name = (item.submitterName || '').toLowerCase()
      const email = (item.submitterEmail || '').toLowerCase()
      const title = (item.title || '').toLowerCase()
      const comments = item.comments?.some((c) => (c.content || '').toLowerCase().includes(q))
      return content.includes(q) || name.includes(q) || email.includes(q) || title.includes(q) || comments
    })
  }, [rawItems, debouncedSearch])

  const totalItems = useMemo(() => extractTotalCount(data, rawItems.length), [data, rawItems.length])

  const hasNextPage = page * pageSize < totalItems
  const hasPreviousPage = page > 1

  const rangeStart = rawItems.length > 0 ? (page - 1) * pageSize + 1 : 0
  const rangeEnd = Math.min((page - 1) * pageSize + rawItems.length, totalItems)

  const totalComments = rawItems.reduce((acc, curr) => {
    return acc + (curr.comments?.length || 0)
  }, 0)

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <MessagesSquare className="w-6 h-6 text-brand-600" />
            Customer Feedbacks Hub
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Review incoming feedback submitted by your tenant customers, inspect discussions, and respond with official product team comments.
          </p>
        </div>

        {/* Summary Metric Counters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 rounded-xl bg-white px-3.5 py-2 border border-slate-200/80 shadow-2xs">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <MessagesSquare size={15} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Feedbacks</span>
              <span className="font-mono text-sm font-extrabold text-slate-900">{totalItems}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl bg-white px-3.5 py-2 border border-slate-200/80 shadow-2xs">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <MessageCircle size={15} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Comments</span>
              <span className="font-mono text-sm font-extrabold text-slate-900">{totalComments}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search feedback content, customer name, email..."
          />
          {isFetching && <Spinner className="text-brand-600" size={18} />}
        </div>
        <div className="text-xs font-medium text-slate-500">
          Showing <span className="font-bold text-slate-900">{filteredItems.length}</span> feedback items
        </div>
      </div>

      {/* Main Feedback List */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200/80 bg-white shadow-xs">
          <div className="flex flex-col items-center gap-2.5 text-xs text-slate-500">
            <Spinner size={28} className="text-brand-600" />
            <span>Loading customer feedback submissions...</span>
          </div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-xs">
          <EmptyState
            icon={MessagesSquare}
            title="No customer feedback found"
            description={
              debouncedSearch
                ? 'No feedback submissions match your search query.'
                : 'Customer feedback submissions under your tenant will appear here for review and response.'
            }
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            {filteredItems.map((item, idx) => (
              <CompanyFeedbackCard key={item.id || `fb-${idx}`} feedback={item} />
            ))}
          </div>

          {totalItems > 0 && (
            <div className="px-5 py-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
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
