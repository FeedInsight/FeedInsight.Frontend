import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, UserPlus, Eye, Lock, Unlock, Trash2, ShieldCheck, ShieldAlert } from 'lucide-react'
import Table from '@shared/components/ui/Table.jsx'
import Button from '@shared/components/ui/Button.jsx'
import Badge from '@shared/components/ui/Badge.jsx'
import Spinner from '@shared/components/ui/Spinner.jsx'
import SearchBar from '@shared/components/ui/SearchBar.jsx'
import TablePagination from '@shared/components/ui/TablePagination.jsx'
import EmptyState from '@shared/components/ui/EmptyState.jsx'
import { useDebounce } from '@shared/hooks/useDebounce.js'
import { usePagination } from '@shared/hooks/usePagination.js'
import {
  useCompanyCustomers,
  useDeleteCustomer,
  useLockCustomer,
  useUnlockCustomer,
} from '../hooks/useCustomers.js'
import DeleteCustomerModal from '../components/DeleteCustomerModal.jsx'
import LockCustomerModal from '../components/LockCustomerModal.jsx'
import { ROUTES } from '@router/routes.js'
import { formatDateTime } from '@shared/utils/formatDate.js'

function isCustomerLocked(customer) {
  if (!customer) return false
  if (customer.isLocked === true || customer.IsLocked === true) return true
  if (customer.isActive === false || customer.IsActive === false) return true
  if (customer.status && String(customer.status).toLowerCase() === 'locked') return true
  if (customer.lockoutEnd && new Date(customer.lockoutEnd) > new Date()) return true
  return false
}

export default function CustomersPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingCustomer, setDeletingCustomer] = useState(null)
  const [lockingCustomer, setLockingCustomer] = useState(null)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const { page, pageSize, params, setPage, nextPage, prevPage } = usePagination(10)

  const { data, isLoading, isFetching } = useCompanyCustomers({
    searchTerm: debouncedSearchTerm || undefined,
    page: params.page,
    pageSize: params.pageSize,
  })

  const { mutate: deleteCust, isPending: isDeleting } = useDeleteCustomer()
  const { mutate: lockCust, isPending: isLocking } = useLockCustomer()
  const { mutate: unlockCust, isPending: isUnlocking } = useUnlockCustomer()

  useEffect(() => {
    setPage(1)
  }, [debouncedSearchTerm, setPage])

  const customers = useMemo(() => {
    if (!data) return []
    if (Array.isArray(data)) return data
    if (Array.isArray(data?.items)) return data.items
    if (Array.isArray(data?.data)) return data.data
    if (Array.isArray(data?.$values)) return data.$values
    return []
  }, [data])

  const totalItems = data?.totalItems ?? data?.totalCount ?? data?.pagination?.totalItems ?? customers.length
  const hasNextPage =
    data?.hasNextPage ?? data?.pagination?.hasNextPage ?? page * pageSize < totalItems
  const hasPreviousPage =
    data?.hasPreviousPage ?? data?.pagination?.hasPreviousPage ?? page > 1

  const rangeStart = customers.length > 0 ? (page - 1) * pageSize + 1 : 0
  const rangeEnd = Math.min((page - 1) * pageSize + customers.length, totalItems)

  const getInitials = (firstName, lastName, email) => {
    if (firstName || lastName) {
      return `${(firstName || '')[0] || ''}${(lastName || '')[0] || ''}`.toUpperCase() || 'CU'
    }
    if (email) return email.substring(0, 2).toUpperCase()
    return 'CU'
  }

  const handleConfirmDelete = () => {
    if (!deletingCustomer) return
    const id = deletingCustomer.id || deletingCustomer.userId || deletingCustomer.customerId
    deleteCust(id, {
      onSuccess: () => setDeletingCustomer(null),
    })
  }

  const handleConfirmLock = () => {
    if (!lockingCustomer) return
    const id = lockingCustomer.id || lockingCustomer.userId || lockingCustomer.customerId
    lockCust(
      { id, reason: 'Locked via customer management table' },
      {
        onSuccess: () => setLockingCustomer(null),
      },
    )
  }

  const handleUnlock = (cust) => {
    const id = cust.id || cust.userId || cust.customerId
    unlockCust(id)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-600" />
            <span>Company Customers</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage customer accounts associated with your tenant organization.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate(ROUTES.workspaceAddCustomer)}
          className="shadow-md shadow-brand-500/20"
        >
          <UserPlus size={16} />
          <span>Add New Customer</span>
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customers by name or email..."
          />
          {isFetching && <Spinner className="text-brand-600" size={18} />}
        </div>
        <div className="text-xs font-medium text-slate-500">
          Total Customers: <span className="font-bold text-slate-900">{totalItems}</span>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <Table>
          <Table.Head>
            <Table.Row className="bg-slate-50/80 border-b border-slate-200/80">
              <Table.Cell as="th" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Customer
              </Table.Cell>
              <Table.Cell as="th" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email
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
            {isLoading ? (
              <Table.Row>
                <Table.Cell colSpan={5} className="text-center py-16 text-sm text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2.5">
                    <Spinner size={28} className="text-brand-600" />
                    <span>Loading customers...</span>
                  </div>
                </Table.Cell>
              </Table.Row>
            ) : customers.length > 0 ? (
              customers.map((cust, idx) => {
                const id = cust.id || cust.userId || cust.customerId
                const fullName =
                  cust.fullName || `${cust.firstName || ''} ${cust.lastName || ''}`.trim() || 'Customer'
                const createdAtStr = cust.createdAt || cust.createdDate ? formatDateTime(cust.createdAt || cust.createdDate) : '—'
                const isLocked = isCustomerLocked(cust)

                return (
                  <Table.Row
                    key={id || cust.email || `cust-${idx}`}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    <Table.Cell className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0 ring-2 ring-white">
                          {getInitials(cust.firstName, cust.lastName, cust.email)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 text-sm">
                            {fullName}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">ID: {id?.substring(0, 8)}...</span>
                        </div>
                      </div>
                    </Table.Cell>

                    <Table.Cell className="text-slate-600 font-medium text-sm py-3.5">
                      {cust.email}
                    </Table.Cell>

                    <Table.Cell className="py-3.5">
                      {isLocked ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
                          <Lock size={11} className="text-rose-600" />
                          <span>Locked</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                          <ShieldCheck size={11} className="text-emerald-600" />
                          <span>Active</span>
                        </span>
                      )}
                    </Table.Cell>

                    <Table.Cell className="text-slate-500 text-sm py-3.5">
                      {createdAtStr}
                    </Table.Cell>

                    <Table.Cell className="text-right py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        {/* 1. View Button */}
                        <Button
                          variant="secondary"
                          size="xs"
                          onClick={() => navigate(`/workspace/customers/${id}`)}
                          title="View customer details"
                          className="text-xs shadow-2xs font-semibold"
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </Button>

                        {/* 2. Lock / Unlock Button */}
                        {isLocked ? (
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => handleUnlock(cust)}
                            title="Unlock customer account"
                            disabled={isUnlocking}
                            className="text-xs font-semibold text-emerald-700 hover:bg-emerald-50 border-emerald-300 shadow-2xs"
                          >
                            <Unlock size={14} />
                            <span>Unlock</span>
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => setLockingCustomer(cust)}
                            title="Lock customer account"
                            disabled={isLocking}
                            className="text-xs font-semibold text-amber-700 hover:bg-amber-50 border-amber-300 shadow-2xs"
                          >
                            <Lock size={14} />
                            <span>Lock</span>
                          </Button>
                        )}

                        {/* 3. Delete Button */}
                        <Button
                          variant="danger"
                          size="xs"
                          onClick={() => setDeletingCustomer(cust)}
                          title="Delete customer"
                          disabled={isDeleting}
                          className="text-xs font-semibold shadow-2xs"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                )
              })
            ) : (
              <Table.Row>
                <Table.Cell colSpan={5} className="text-center py-16 text-sm text-slate-500">
                  <EmptyState
                    icon={Users}
                    title="No customers found"
                    description={
                      debouncedSearchTerm
                        ? 'No customers match your search query.'
                        : 'No company customers registered under your tenant yet.'
                    }
                  />
                </Table.Cell>
              </Table.Row>
            )}
          </tbody>
        </Table>

        {totalItems > 0 && (
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
        )}
      </div>

      <LockCustomerModal
        isOpen={Boolean(lockingCustomer)}
        customerName={
          lockingCustomer
            ? `${lockingCustomer.firstName || ''} ${lockingCustomer.lastName || ''}`.trim()
            : ''
        }
        customerEmail={lockingCustomer?.email}
        isSubmitting={isLocking}
        onConfirm={handleConfirmLock}
        onCancel={() => setLockingCustomer(null)}
      />

      <DeleteCustomerModal
        isOpen={Boolean(deletingCustomer)}
        customerName={
          deletingCustomer
            ? `${deletingCustomer.firstName || ''} ${deletingCustomer.lastName || ''}`.trim()
            : ''
        }
        customerEmail={deletingCustomer?.email}
        isSubmitting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingCustomer(null)}
      />
    </div>
  )
}
