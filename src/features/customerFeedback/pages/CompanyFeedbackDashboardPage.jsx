import { useState, useMemo, useEffect } from 'react'
import { MessagesSquare, MessageCircle, Bell } from 'lucide-react'
import SearchBar from '@shared/components/ui/SearchBar.jsx'
import Spinner from '@shared/components/ui/Spinner.jsx'
import EmptyState from '@shared/components/ui/EmptyState.jsx'
import Button from '@shared/components/ui/Button.jsx'
import TablePagination from '@shared/components/ui/TablePagination.jsx'
import CompanyFeedbackCard from '../components/CompanyFeedbackCard.jsx'
import { useDevelopmentCompanyFeedbacks } from '../hooks/useCustomerFeedback.js'
import { usePOUnseenCompanyFeedbacks } from '../hooks/usePOUnseenCompanyFeedbacks.js'
import { useCategories } from '@features/categories/hooks/useCategories.js'
import { useDebounce } from '@shared/hooks/useDebounce.js'
import { usePagination } from '@shared/hooks/usePagination.js'
import { normalizeFeedbackList, extractTotalCount } from '../utils/feedbackNormalizer.js'
import PageHeader from '@shared/components/ui/PageHeader.jsx'

export default function CompanyFeedbackDashboardPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 300)
  const { page, pageSize, params, setPage, nextPage, prevPage } = usePagination(10)

  const { data, isLoading, isFetching } = useDevelopmentCompanyFeedbacks({
    page: params.page,
    pageSize: params.pageSize,
  })

  const { data: rawCategories } = useCategories()
  const categoriesMap = useMemo(() => {
    const map = {}
    const cats = Array.isArray(rawCategories)
      ? rawCategories
      : Array.isArray(rawCategories?.data)
        ? rawCategories.data
        : Array.isArray(rawCategories?.items)
          ? rawCategories.items
          : Array.isArray(rawCategories?.$values)
            ? rawCategories.$values
            : []

    cats.forEach((c) => {
      if (c && c.id && c.name) {
        map[c.id] = c.name
      }
    })
    return map
  }, [rawCategories])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, setPage])

  const rawItems = useMemo(() => {
    return normalizeFeedbackList(data)
  }, [data])

  const { markAsSeen, markAllAsSeen, isUnseen, totalUnseenCount } = usePOUnseenCompanyFeedbacks(rawItems)

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
      <PageHeader
        title="Customer Feedbacks Hub"
        description="Review incoming feedback submitted by your tenant customers, inspect discussions, and respond with official product team comments."
      >
        <div
          className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2 border shadow-2xs transition-colors ${totalUnseenCount > 0
              ? 'bg-amber-50/80 border-amber-300/80 text-amber-900 ring-2 ring-amber-100'
              : 'bg-white border-slate-200/80'
            }`}
        >
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-lg shadow-2xs ${totalUnseenCount > 0 ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
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
              onClick={() => markAllAsSeen(rawItems)}
              className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline shrink-0 ml-1"
              title="Mark all company feedbacks as read"
            >
              Mark read
            </button>
          )}
        </div>

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
      </PageHeader>

      {totalUnseenCount > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-indigo-500/10 border border-amber-300/80 p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs shrink-0">
              <Bell size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                You have {totalUnseenCount} new customer {totalUnseenCount === 1 ? 'feedback' : 'feedbacks'}!
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Review incoming feedback submitted by your tenant customers and reply with official comments.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => markAllAsSeen(rawItems)}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 border-amber-200 bg-white"
            >
              Mark all read
            </Button>
          </div>
        </div>
      )}

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
              <CompanyFeedbackCard
                key={item.id || `fb-${idx}`}
                feedback={item}
                categoriesMap={categoriesMap}
                isUnseen={isUnseen(item.id)}
                onMarkSeen={markAsSeen}
              />
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

