import { useState, useEffect } from 'react'
import Spinner from '@shared/components/ui/Spinner'
import { useTenants } from '../hooks/useTenants'
import { AlertCircle, Building, Ban, CheckCircle, Calendar, Hash } from 'lucide-react'
import EmptyState from '@shared/components/ui/EmptyState'
import Table from '@shared/components/ui/Table'
import SearchBar from '@shared/components/ui/SearchBar.jsx'
import TablePagination from '@shared/components/ui/TablePagination.jsx'
import { useDebounce } from '@shared/hooks/useDebounce'
import { usePagination } from '@shared/hooks/usePagination'
import Badge from '@shared/components/ui/Badge'
import ChangeTenantStatusModal from './ChangeTenantStatusModal'
import Button from '@shared/components/ui/Button'

const TenantDirectoryTable = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedTenant, setSelectedTenant] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const { page, pageSize, params, setPage, nextPage, prevPage } = usePagination(10)

  const queryParams = {
    SearchTerm: debouncedSearchTerm || undefined,
    Page: params.page,
    PageSize: params.pageSize,
  }

  const { data, isLoading, isFetching, isError, error } = useTenants(queryParams)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearchTerm, statusFilter, setPage])

  const rawTenants = data?.data ?? data?.items ?? data?.$values
  const allTenants = Array.isArray(rawTenants) ? rawTenants : Array.isArray(data) ? data : []

  const tenants =
    statusFilter === 'all'
      ? allTenants
      : allTenants.filter((tenant) => tenant.status === statusFilter)

  const totalItems = data?.pagination?.totalItems ?? 0
  const hasNextPage = data?.pagination?.hasNextPage ?? false
  const hasPreviousPage = data?.pagination?.hasPreviousPage ?? page > 1

  const rangeStart = tenants.length > 0 ? (page - 1) * pageSize + 1 : 0
  const rangeEnd = Math.min(page * pageSize, totalItems)

  const getCompanyInitials = (name) => {
    if (!name) return 'CO'
    const words = name.trim().split(' ')
    if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase()
    return name.substring(0, 2).toUpperCase()
  }

  if (isError) {
    const message = error?.message || 'An error occurred while loading tenant directory. Please try again.'

    return (
      <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3.5 text-sm text-red-700 shadow-xs">
        <AlertCircle size={18} className="shrink-0 text-red-500" />
        <span>{message}</span>
      </div>
    )
  }

  const hasActiveFilters = Boolean(debouncedSearchTerm) || statusFilter !== 'all'

  return (
    <div className="flex flex-col gap-5">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col gap-4 bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 max-w-2xl">
            <SearchBar
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by company name or tenant ID..."
            />
            {isFetching ? <Spinner className="text-brand-600" size={18} /> : null}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-xs outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all cursor-pointer"
            >
              <option value="all">All status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <Table>
          <Table.Head>
            <Table.Row className="bg-slate-50/80 border-b border-slate-200/80">
              <Table.Cell as="th" className="py-3.5 w-12 text-xs font-semibold uppercase tracking-wider text-slate-500">
                #
              </Table.Cell>
              <Table.Cell as="th" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Company Name
              </Table.Cell>
              <Table.Cell as="th" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Tenant ID
              </Table.Cell>
              <Table.Cell as="th" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </Table.Cell>
              <Table.Cell as="th" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Created At
              </Table.Cell>
              <Table.Cell as="th" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">
                Actions
              </Table.Cell>
            </Table.Row>
          </Table.Head>
          <tbody className="divide-y divide-slate-100">
            {tenants.length > 0 ? (
              tenants.map((tenant, index) => {
                const isActive = tenant.status === 'Active'
                const companyName = tenant.companyName ?? 'Unknown Company'

                return (
                  <Table.Row key={tenant.id} className="hover:bg-slate-50/60 transition-colors">
                    <Table.Cell className="py-3 text-slate-400 font-mono text-xs">
                      {rangeStart + index}
                    </Table.Cell>

                    <Table.Cell className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shadow-2xs shrink-0">
                          {getCompanyInitials(companyName)}
                        </div>
                        <span className="font-semibold text-slate-900 text-sm">{companyName}</span>
                      </div>
                    </Table.Cell>

                    <Table.Cell className="py-3">
                      <span className="inline-flex items-center gap-1 font-mono text-xs text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-md border border-slate-200/60">
                        <Hash size={11} className="text-slate-400" />
                        {tenant.id ?? 'Unknown ID'}
                      </span>
                    </Table.Cell>

                    <Table.Cell className="py-3">
                      <Badge
                        className={
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 font-semibold px-2.5 py-1'
                            : 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20 font-semibold px-2.5 py-1'
                        }
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {tenant.status ?? 'Unknown'}
                      </Badge>
                    </Table.Cell>

                    <Table.Cell className="py-3 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-400" />
                        <span>
                          {tenant.createdAt
                            ? new Date(tenant.createdAt).toLocaleDateString('en-US', {
                                dateStyle: 'medium',
                              })
                            : 'Unknown Date'}
                        </span>
                      </div>
                    </Table.Cell>

                    <Table.Cell className="py-3 text-right">
                      <div className="flex items-center justify-end">
                        {isActive ? (
                          <Button
                            variant="danger"
                            size="xs"
                            onClick={() => {
                              setSelectedTenant(tenant)
                              setIsModalOpen(true)
                            }}
                            title="Suspend tenant account"
                          >
                            <Ban size={14} />
                            <span>Suspend</span>
                          </Button>
                        ) : (
                          <Button
                            variant="success"
                            size="xs"
                            onClick={() => {
                              setSelectedTenant(tenant)
                              setIsModalOpen(true)
                            }}
                            title="Activate tenant account"
                          >
                            <CheckCircle size={14} />
                            <span>Activate</span>
                          </Button>
                        )}
                      </div>
                    </Table.Cell>
                  </Table.Row>
                )
              })
            ) : (
              <Table.Row>
                <Table.Cell colSpan={6} className="text-center py-12 text-sm text-slate-500">
                  {hasActiveFilters ? (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Building size={32} className="text-slate-300" />
                      <p className="font-medium text-slate-600">No tenants match the search filter.</p>
                    </div>
                  ) : (
                    <EmptyState
                      icon={Building}
                      title="No tenants found"
                      description="Companies will appear here once they register on the platform."
                    />
                  )}
                </Table.Cell>
              </Table.Row>
            )}
          </tbody>
        </Table>

        <div className="px-5 border-t border-slate-100 bg-slate-50/40">
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
      </div>

      <ChangeTenantStatusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tenant={selectedTenant}
      />
    </div>
  )
}

export default TenantDirectoryTable