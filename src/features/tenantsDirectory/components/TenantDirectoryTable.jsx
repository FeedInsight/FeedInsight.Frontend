import { useState, useEffect } from 'react'
import Spinner from '@shared/components/ui/Spinner'
import { useTenants } from '../hooks/useTenants'
import { AlertCircle, Building, Ban, CheckCircle } from 'lucide-react'
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

  if (isError) {
    const message = error?.message || 'An error happened. Please try again'

    return (
      <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mt-4">
        <AlertCircle size={18} />
        <span>{message}</span>
      </div>
    )
  }

  const hasActiveFilters = Boolean(debouncedSearchTerm) || statusFilter !== 'all'

  return (
    <div className="flex flex-col">
      <div className="flex flex-col pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full">
          <div className="flex items-center gap-3 w-full max-w-3xl">
            <SearchBar
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by company name..."
            />
            {isFetching ? <Spinner className="text-slate-500" size={18} /> : null}
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none"
          >
            <option value="all">All status</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell as="th" className="w-14">
                #
              </Table.Cell>
              <Table.Cell as="th">Company Name</Table.Cell>
              <Table.Cell as="th">Tenant ID</Table.Cell>
              <Table.Cell as="th">Status</Table.Cell>
              <Table.Cell as="th">Created At</Table.Cell>
              <Table.Cell as="th" className="text-right">
                Actions
              </Table.Cell>
            </Table.Row>
          </Table.Head>
          <tbody>
            {tenants.length > 0 ? (
              tenants.map((tenant, index) => (
                <Table.Row key={tenant.id}>
                  <Table.Cell className="text-slate-400">{rangeStart + index}</Table.Cell>
                  <Table.Cell className="font-medium text-slate-900">
                    {tenant.companyName ?? 'Unknown Company'}
                  </Table.Cell>
                  <Table.Cell className="font-mono text-xs text-slate-400">
                    {tenant.id ?? 'Unknown ID'}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      className={
                        tenant.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }
                    >
                      {tenant.status ?? 'Unknown Status'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="text-sm text-slate-500">
                    {tenant.createdAt
                      ? new Date(tenant.createdAt).toLocaleDateString('en-US', {
                          dateStyle: 'medium',
                        })
                      : 'Unknown Date'}
                  </Table.Cell>

                  <Table.Cell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1.5 text-slate-400 hover:text-slate-600"
                      aria-label={tenant.status === 'Active' ? 'Suspend tenant' : 'Activate tenant'}
                      title={tenant.status === 'Active' ? 'Suspend tenant' : 'Activate tenant'}
                      onClick={() => {
                        setSelectedTenant(tenant)
                        setIsModalOpen(true)
                      }}
                    >
                      {tenant.status === 'Active' ? (
                        <Ban
                          size={18}
                          className="text-slate-400 transition-colors hover:text-red-600"
                        />
                      ) : (
                        <CheckCircle
                          size={18}
                          className="text-slate-400 transition-colors hover:text-emerald-600"
                        />
                      )}
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={6} className="text-center py-10 text-sm text-slate-500">
                  {hasActiveFilters ? (
                    'No tenants with this name'
                  ) : (
                    <EmptyState
                      icon={Building}
                      title="No tenants found"
                      description="Companies will appear here once they sign up"
                    />
                  )}
                </Table.Cell>
              </Table.Row>
            )}
          </tbody>
        </Table>
      </div>

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

      <ChangeTenantStatusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tenant={selectedTenant}
      />
    </div>
  )
}

export default TenantDirectoryTable