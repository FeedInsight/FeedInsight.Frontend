import { useState, useEffect } from 'react'
import Spinner from '@shared/components/ui/Spinner'
import { useTenants } from '../hooks/useTenants'
import { AlertCircle, Building } from 'lucide-react'
import EmptyState from '@shared/components/ui/EmptyState'
import Table from '@shared/components/ui/Table'
import SearchBar from '@shared/components/ui/SearchBar.jsx'
import TablePagination from '@shared/components/ui/TablePagination.jsx'
import { useDebounce } from '@shared/hooks/useDebounce'
import { usePagination } from '@shared/hooks/usePagination'

const TenantDirectoryTable = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const { page, pageSize, params, setPage, nextPage, prevPage } = usePagination(10)

  const queryParams = {
    SearchTerm: debouncedSearchTerm || undefined,
    Page: params.page,
    PageSize: params.pageSize,
  }

  const { data, isLoading, isError, error } = useTenants(queryParams)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearchTerm, setPage])

  const tenants = data?.data ?? []

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

  const hasActiveFilters = Boolean(debouncedSearchTerm)

  return (
    <div className="flex flex-col gap-4">
      <SearchBar
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search by company name..."
      />

      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Cell as="th" className="w-14">
              #
            </Table.Cell>
            <Table.Cell as="th">Company Name</Table.Cell>
            <Table.Cell as="th">Tenant ID</Table.Cell>
          </Table.Row>
        </Table.Head>
        <tbody>
          {tenants.length > 0 ? (
            tenants.map((tenant, index) => (
              <Table.Row key={tenant.id}>
                <Table.Cell className="text-slate-400">{rangeStart + index}</Table.Cell>
                <Table.Cell className="font-medium text-slate-900">{tenant.companyName}</Table.Cell>
                <Table.Cell className="font-mono text-xs text-slate-400">{tenant.id}</Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={3} className="text-center py-10 text-sm text-slate-500">
                {isLoading ? (
                  <div className="flex justify-center items-center py-4">
                    <Spinner size={24} className="text-slate-400" />
                  </div>
                ) : hasActiveFilters ? (
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

      <TablePagination
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        totalItems={totalItems}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        onNext={nextPage}
        onPrevious={prevPage}
        isLoading={isLoading}
      />
    </div>
  )
}

export default TenantDirectoryTable
