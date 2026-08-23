import { useEffect, useState } from 'react'
import { Lock, Unlock, Building2, Users } from 'lucide-react'
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
import LockConfirmModal from './LockConfirmModal.jsx'
import SearchBar from '@shared/components/ui/SearchBar.jsx'
import TablePagination from '@shared/components/ui/TablePagination.jsx'

export default function AdminUserTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTenantId, setSelectedTenantId] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [pendingLockUser, setPendingLockUser] = useState(null)
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

  const handleUnlock = (user) => {
    const id = user.userId ?? user.id
    toggleActiveState.mutate({ id, isActive: false })
  }

  const handleRequestLock = (user) => {
    setPendingLockUser(user)
  }

  const handleConfirmLock = () => {
    if (!pendingLockUser) return
    const id = pendingLockUser.userId ?? pendingLockUser.id
    toggleActiveState.mutate({ id, isActive: true }, { onSuccess: () => setPendingLockUser(null) })
  }

  const handleCancelLock = () => {
    if (toggleActiveState.isPending) return
    setPendingLockUser(null)
  }

  const getInitials = (name, email) => {
    if (name && name.trim()) {
      const parts = name.trim().split(' ')
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      return name.substring(0, 2).toUpperCase()
    }
    if (email) return email.substring(0, 2).toUpperCase()
    return 'AU'
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Top Filter & Action Bar */}
      <div className="flex flex-col gap-4 bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:max-w-3xl">
            <div className="flex items-center gap-2 flex-1">
              <SearchBar
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name, email, or company..."
              />
              {isFetching ? <Spinner className="text-brand-600" size={18} /> : null}
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center">
                <select
                  value={selectedTenantId}
                  onChange={(event) => setSelectedTenantId(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-xs outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all cursor-pointer disabled:opacity-60"
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
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-xs outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all cursor-pointer"
              >
                <option value="all">All status</option>
                <option value="active">Active</option>
                <option value="locked">Locked</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <Table>
          <Table.Head>
            <Table.Row className="bg-slate-50/80 border-b border-slate-200/80">
              <Table.Cell as="th" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                User
              </Table.Cell>
              <Table.Cell as="th" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email
              </Table.Cell>
              <Table.Cell as="th" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Tenant / Organization
              </Table.Cell>
              <Table.Cell as="th" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </Table.Cell>
              <Table.Cell as="th" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">
                Actions
              </Table.Cell>
            </Table.Row>
          </Table.Head>
          <tbody className="divide-y divide-slate-100">
            {users.length > 0 ? (
              users.map((user, idx) => {
                const id = user.userId ?? user.id
                const isLocked = Boolean(user.isLocked)
                const isRowPending = pendingUserId === id
                const name = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Admin User'

                return (
                  <Table.Row key={id ?? user.email ?? `row-${idx}`} className="hover:bg-slate-50/60 transition-colors">
                    <Table.Cell className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center shadow-xs shrink-0 ring-2 ring-white">
                          {getInitials(name, user.email)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 text-sm">{name}</span>
                          <span className="text-xs text-slate-400 font-normal sm:hidden">{user.email}</span>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="text-slate-600 font-medium text-sm">{user.email}</Table.Cell>
                    <Table.Cell className="text-slate-600 font-medium text-sm">
                      <div className="flex items-center gap-1.5">
                        <Building2 size={14} className="text-slate-400 shrink-0" />
                        <span>{user.companyName || user.tenantName || user.tenant?.name || '—'}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        className={
                          !isLocked
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 font-semibold px-2.5 py-1'
                            : 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20 font-semibold px-2.5 py-1'
                        }
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${!isLocked ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {!isLocked ? 'Active' : 'Locked'}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="text-right py-3">
                      <div className="flex items-center justify-end">
                        {isLocked ? (
                          <Button
                            variant="success"
                            size="xs"
                            onClick={() => handleUnlock(user)}
                            disabled={isRowPending}
                            isLoading={isRowPending}
                            loadingText="Unlocking…"
                            title="Unlock account access for this user"
                          >
                            <Unlock size={14} />
                            <span>Unlock</span>
                          </Button>
                        ) : (
                          <Button
                            variant="danger"
                            size="xs"
                            onClick={() => handleRequestLock(user)}
                            disabled={isRowPending}
                            isLoading={isRowPending}
                            loadingText="Locking…"
                            title="Lock account access for this user"
                          >
                            <Lock size={14} />
                            <span>Lock</span>
                          </Button>
                        )}
                      </div>
                    </Table.Cell>
                  </Table.Row>
                )
              })
            ) : (
              <Table.Row>
                <Table.Cell colSpan={5} className="text-center py-12 text-sm text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Users size={32} className="text-slate-300" />
                    <p className="font-medium text-slate-600">
                      {!isLoading && hasActiveFilters
                        ? 'No admin users match the selected search or filters.'
                        : 'No admin users registered yet.'}
                    </p>
                  </div>
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

      <LockConfirmModal
        isOpen={Boolean(pendingLockUser)}
        email={pendingLockUser?.email}
        isSubmitting={
          toggleActiveState.isPending &&
          pendingUserId === (pendingLockUser?.userId ?? pendingLockUser?.id)
        }
        onConfirm={handleConfirmLock}
        onCancel={handleCancelLock}
      />
    </div>
  )
}

