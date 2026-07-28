import { useEffect, useState } from 'react'
import { Lock, Unlock, Plus, Loader2 } from 'lucide-react'
import Table from '@shared/components/ui/Table.jsx'
import Button from '@shared/components/ui/Button.jsx'
import Badge from '@shared/components/ui/Badge.jsx'
import Spinner from '@shared/components/ui/Spinner.jsx'
import { useDebounce } from '@shared/hooks/useDebounce.js'
import { usePagination } from '@shared/hooks/usePagination.js'
import {
  useProductOwners,
  useTenantLookup,
  useAdminUserMutations,
} from '@features/adminUsers/hooks/useAdminUsers.js'
import InviteUserModal from './InviteUserModal.jsx'
import SearchBar from '@shared/components/ui/SearchBar.jsx'
import TablePagination from '@shared/components/ui/TablePagination.jsx'

export default function AdminUserTable() {
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTenantId, setSelectedTenantId] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const { page, pageSize, params, setPage, nextPage, prevPage } = usePagination(5)

  const { data: tenants = [], isLoading: isTenantLoading } = useTenantLookup()
  const { data, isLoading, isFetching } = useProductOwners({
    searchTerm: debouncedSearchTerm || undefined,
    tenantId: selectedTenantId || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    page: params.page,
    pageSize: params.pageSize,
  })
  const { toggleActiveState } = useAdminUserMutations()

  // Reset to page 1 whenever any filter changes, so we don't request a page
  // that no longer exists for the new filtered result set.
  useEffect(() => {
    setPage(1)
  }, [debouncedSearchTerm, selectedTenantId, statusFilter, setPage])

  const users = Array.isArray(data?.items) ? data.items : []

  const totalItems = data?.totalItems ?? 0
  const hasNextPage = data?.hasNextPage ?? false
  const hasPreviousPage = data?.hasPreviousPage ?? page > 1

  const tenantOptions = Array.isArray(tenants) ? tenants : []

  const hasActiveFilters =
    Boolean(debouncedSearchTerm) || Boolean(selectedTenantId) || statusFilter !== 'all'

  const rangeStart = users.length > 0 ? (page - 1) * pageSize + 1 : 0
  const rangeEnd = (page - 1) * pageSize + users.length

  const pendingUserId = toggleActiveState.isPending ? toggleActiveState.variables?.id : null

  const handleToggleLock = (user) => {
    const id = user.userId ?? user.id
    toggleActiveState.mutate({ id, isActive: !user.isLocked })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 w-full">
          <div className="flex items-center gap-3 w-full max-w-3xl">
            <SearchBar
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name, email, or company..."
            />
            {isFetching ? <Spinner className="text-slate-500" size={18} /> : null}
          </div>
          <select
            value={selectedTenantId}
            onChange={(event) => setSelectedTenantId(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none"
            disabled={isTenantLoading}
          >
            <option value="">All tenants</option>
            {tenantOptions.map((tenant) => (
              <option
                key={tenant.id ?? tenant.tenantId ?? tenant.id}
                value={tenant.id ?? tenant.tenantId ?? tenant.id}
              >
                {tenant.name ||
                  tenant.companyName ||
                  tenant.displayName ||
                  tenant.tenantName ||
                  tenant.tenant ||
                  tenant.id ||
                  tenant.tenantId ||
                  'Unnamed tenant'}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none"
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="locked">Locked</option>
          </select>
        </div>

        <div className="flex justify-end">
          <Button size="sm" onClick={() => setIsInviteOpen(true)}>
            <Plus size={16} /> Invite user
          </Button>
        </div>
      </div>

      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Cell as="th">Name</Table.Cell>
            <Table.Cell as="th">Email</Table.Cell>
            <Table.Cell as="th">Tenant/Company</Table.Cell>
            <Table.Cell as="th">Status</Table.Cell>
            <Table.Cell as="th" className="text-right">
              Actions
            </Table.Cell>
          </Table.Row>
        </Table.Head>
        <tbody>
          {users.length > 0 ? (
            users.map((user, idx) => {
              const id = user.userId ?? user.id
              const isLocked = Boolean(user.isLocked)
              const isRowPending = pendingUserId === id

              return (
                <Table.Row key={id ?? user.email ?? `row-${idx}`}>
                  <Table.Cell className="font-medium">
                    {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim()}
                  </Table.Cell>
                  <Table.Cell className="text-slate-500">{user.email}</Table.Cell>
                  <Table.Cell className="text-slate-500">
                    {user.companyName || user.tenantName || user.tenant?.name || '—'}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      className={
                        !isLocked
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }
                    >
                      {!isLocked ? 'Active' : 'Locked'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    <button
                      onClick={() => handleToggleLock(user)}
                      disabled={isRowPending}
                      aria-label={isLocked ? 'Unlock user' : 'Lock user'}
                      title={isLocked ? 'Unlock user' : 'Lock user'}
                      className="disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isRowPending ? (
                        <Loader2 size={16} className="text-slate-400 animate-spin" />
                      ) : isLocked ? (
                        <Unlock size={16} className="text-slate-400 hover:text-emerald-600" />
                      ) : (
                        <Lock size={16} className="text-slate-400 hover:text-red-600" />
                      )}
                    </button>
                  </Table.Cell>
                </Table.Row>
              )
            })
          ) : (
            <Table.Row>
              <Table.Cell colSpan={5} className="text-center py-10 text-sm text-slate-500">
                {!isLoading && hasActiveFilters
                  ? 'No users match the selected search, tenant, or status filter.'
                  : 'No users found.'}
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
        isLoading={isLoading || isFetching}
      />

      <InviteUserModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
    </div>
  )
}
