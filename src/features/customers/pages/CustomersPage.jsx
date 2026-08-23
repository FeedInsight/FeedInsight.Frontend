import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  UserPlus,
  Eye,
  Lock,
  Unlock,
  Trash2,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react'
import Table from '@shared/components/ui/Table.jsx'
import Button from '@shared/components/ui/Button.jsx'
import Spinner from '@shared/components/ui/Spinner.jsx'
import SearchBar from '@shared/components/ui/SearchBar.jsx'
import TablePagination from '@shared/components/ui/TablePagination.jsx'
import EmptyState from '@shared/components/ui/EmptyState.jsx'
import { useDebounce } from '@shared/hooks/useDebounce.js'
import { usePagination } from '@shared/hooks/usePagination.js'
import {
  useCompanyCustomers,
  useDeleteCustomer,
  useLockCompanyCustomer,
  useUnlockCompanyCustomer,
} from '../hooks/useCustomers.js'
import DeleteCustomerModal from '../components/DeleteCustomerModal.jsx'
import LockCustomerModal from '../components/LockCustomerModal.jsx'
import UnlockCustomerModal from '../components/UnlockCustomerModal.jsx'
import { ROUTES } from '@router/routes.js'
import { formatDateTime } from '@shared/utils/formatDate.js'
import PageHeader from '@shared/components/ui/PageHeader.jsx'

function isCustomerLocked(customer) {
  if (!customer) return false
  if (customer.isLocked === true || customer.IsLocked === true) return true
  if (customer.isActive === false || customer.IsActive === false) return true
  if (customer.isLockedOut === true || customer.IsLockedOut === true) return true
  if (typeof customer.status === 'string' && customer.status.toLowerCase() === 'locked') return true
  if (typeof customer.status === 'string' && customer.status.toLowerCase() === 'inactive') return true
  if (customer.lockoutEnd && new Date(customer.lockoutEnd) > new Date()) return true
  return false
}

export default function CustomersPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('active') // 'active' | 'locked'
  const [searchTerm, setSearchTerm] = useState('')
  const [lockingCustomer, setLockingCustomer] = useState(null)
  const [unlockingCustomer, setUnlockingCustomer] = useState(null)
  const [deletingCustomer, setDeletingCustomer] = useState(null)

  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const { page, pageSize, params, setPage, nextPage, prevPage } = usePagination(20)

  const { data, isLoading, isFetching } = useCompanyCustomers({
    searchTerm: debouncedSearchTerm || undefined,
    page: params.page,
    pageSize: params.pageSize,
  })

  const { mutate: lockCust, isPending: isLocking } = useLockCompanyCustomer()
  const { mutate: unlockCust, isPending: isUnlocking } = useUnlockCompanyCustomer()
  const { mutate: deleteCust, isPending: isDeleting } = useDeleteCustomer()

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

  const activeCustomers = useMemo(() => {
    return customers.filter((cust) => !isCustomerLocked(cust))
  }, [customers])

  const lockedCustomers = useMemo(() => {
    return customers.filter((cust) => isCustomerLocked(cust))
  }, [customers])

  const totalItems =
    data?.totalItems ?? data?.totalCount ?? data?.pagination?.totalItems ?? customers.length
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

  const handleConfirmLock = (reason) => {
    if (!lockingCustomer) return
    const id = lockingCustomer.id || lockingCustomer.userId || lockingCustomer.customerId
    lockCust(
      { id, reason },
      {
        onSuccess: () => setLockingCustomer(null),
      }
    )
  }

  const handleConfirmUnlock = () => {
    if (!unlockingCustomer) return
    const id = unlockingCustomer.id || unlockingCustomer.userId || unlockingCustomer.customerId
    unlockCust(id, {
      onSuccess: () => setUnlockingCustomer(null),
    })
  }

  const handleConfirmDelete = () => {
    if (!deletingCustomer) return
    const id = deletingCustomer.id || deletingCustomer.userId || deletingCustomer.customerId
    deleteCust(id, {
      onSuccess: () => setDeletingCustomer(null),
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Company Customers"
        description="Manage active and locked customer accounts associated with your organization."
      >
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate(ROUTES.workspaceAddCustomer)}
          className="shadow-md shadow-brand-500/20"
        >
          <UserPlus size={16} />
          <span>Add New Customer</span>
        </Button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customers by name or email..."
          />
          {isFetching && <Spinner className="text-brand-600" size={18} />}
        </div>
        <div className="flex items-center gap-3 text-xs font-medium">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200/80">
            Total: <span className="font-bold text-slate-900">{totalItems}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
            <ShieldCheck size={13} className="text-emerald-600" />
            Active: <span className="font-bold text-emerald-900">{activeCustomers.length}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 font-semibold border border-rose-200">
            <Lock size={13} className="text-rose-600" />
            Locked: <span className="font-bold text-rose-900">{lockedCustomers.length}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('active')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-150 shadow-xs ${activeTab === 'active'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
            }`}
        >
          <ShieldCheck
            size={17}
            className={activeTab === 'active' ? 'text-emerald-400' : 'text-emerald-600'}
          />
          <span>Active Accounts</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold ml-1 ${activeTab === 'active'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
          >
            {activeCustomers.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('locked')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-150 shadow-xs ${activeTab === 'locked'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
            }`}
        >
          <Lock
            size={16}
            className={activeTab === 'locked' ? 'text-rose-400' : 'text-rose-600'}
          />
          <span>Locked Accounts</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold ml-1 ${activeTab === 'locked'
                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
          >
            {lockedCustomers.length}
          </span>
        </button>
      </div>

      {activeTab === 'active' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/80 shadow-xs">
                <ShieldCheck size={18} className="text-emerald-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Active Accounts</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {activeCustomers.length} Active
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  Customer accounts with active workspace and login access.
                </p>
              </div>
            </div>
          </div>

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
                    <Table.Cell colSpan={5} className="text-center py-12 text-sm text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2.5">
                        <Spinner size={24} className="text-brand-600" />
                        <span>Loading active accounts...</span>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ) : activeCustomers.length > 0 ? (
                  activeCustomers.map((cust, idx) => {
                    const id = cust.id || cust.userId || cust.customerId
                    const fullName =
                      cust.fullName || `${cust.firstName || ''} ${cust.lastName || ''}`.trim() || 'Customer'
                    const createdAtStr =
                      cust.createdAt || cust.createdDate
                        ? formatDateTime(cust.createdAt || cust.createdDate)
                        : '—'

                    return (
                      <Table.Row
                        key={id || cust.email || `active-cust-${idx}`}
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
                            </div>
                          </div>
                        </Table.Cell>

                        <Table.Cell className="text-slate-600 font-medium text-sm py-3.5">
                          {cust.email}
                        </Table.Cell>

                        <Table.Cell className="py-3.5">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                            <ShieldCheck size={11} className="text-emerald-600" />
                            <span>Active</span>
                          </span>
                        </Table.Cell>

                        <Table.Cell className="text-slate-500 text-sm py-3.5">
                          {createdAtStr}
                        </Table.Cell>

                        <Table.Cell className="text-right py-3.5">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="secondary"
                              size="xs"
                              onClick={() => navigate(`/workspace/customers/${id}`)}
                              title="View customer profile"
                              className="text-xs shadow-2xs font-semibold"
                            >
                              <Eye size={14} />
                              <span>View</span>
                            </Button>

                            <Button
                              variant="outline"
                              size="xs"
                              onClick={() => setLockingCustomer(cust)}
                              title="Lock customer account"
                              disabled={isLocking}
                              className="text-xs font-semibold text-amber-700 border-amber-200 hover:bg-amber-50 hover:border-amber-300 shadow-2xs"
                            >
                              <Lock size={13} className="text-amber-600" />
                              <span>Lock</span>
                            </Button>

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
                    <Table.Cell colSpan={5} className="text-center py-12 text-sm text-slate-500">
                      <EmptyState
                        icon={ShieldCheck}
                        title="No active accounts found"
                        description={
                          debouncedSearchTerm
                            ? 'No active customers match your search query.'
                            : 'No active customer accounts registered under your organization.'
                        }
                      />
                    </Table.Cell>
                  </Table.Row>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      )}

      {activeTab === 'locked' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200/80 shadow-xs">
                <ShieldAlert size={18} className="text-rose-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Locked Accounts</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    {lockedCustomers.length} Locked
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  Customer accounts with suspended login access.
                </p>
              </div>
            </div>
          </div>

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
                    <Table.Cell colSpan={5} className="text-center py-12 text-sm text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2.5">
                        <Spinner size={24} className="text-brand-600" />
                        <span>Loading locked accounts...</span>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ) : lockedCustomers.length > 0 ? (
                  lockedCustomers.map((cust, idx) => {
                    const id = cust.id || cust.userId || cust.customerId
                    const fullName =
                      cust.fullName || `${cust.firstName || ''} ${cust.lastName || ''}`.trim() || 'Customer'
                    const createdAtStr =
                      cust.createdAt || cust.createdDate
                        ? formatDateTime(cust.createdAt || cust.createdDate)
                        : '—'

                    return (
                      <Table.Row
                        key={id || cust.email || `locked-cust-${idx}`}
                        className="hover:bg-slate-50/70 transition-colors group"
                      >
                        <Table.Cell className="py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-400 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0 ring-2 ring-white">
                              {getInitials(cust.firstName, cust.lastName, cust.email)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-900 text-sm">
                                {fullName}
                              </span>
                            </div>
                          </div>
                        </Table.Cell>

                        <Table.Cell className="text-slate-600 font-medium text-sm py-3.5">
                          {cust.email}
                        </Table.Cell>

                        <Table.Cell className="py-3.5">
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
                            <Lock size={11} className="text-rose-600" />
                            <span>Locked</span>
                          </span>
                        </Table.Cell>

                        <Table.Cell className="text-slate-500 text-sm py-3.5">
                          {createdAtStr}
                        </Table.Cell>

                        <Table.Cell className="text-right py-3.5">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="secondary"
                              size="xs"
                              onClick={() => navigate(`/workspace/customers/${id}`)}
                              title="View customer profile"
                              className="text-xs shadow-2xs font-semibold"
                            >
                              <Eye size={14} />
                              <span>View</span>
                            </Button>

                            <Button
                              variant="outline"
                              size="xs"
                              onClick={() => setUnlockingCustomer(cust)}
                              title="Unlock customer account"
                              disabled={isUnlocking}
                              className="text-xs font-semibold text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 shadow-2xs"
                            >
                              <Unlock size={13} className="text-emerald-600" />
                              <span>Unlock</span>
                            </Button>

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
                    <Table.Cell colSpan={5} className="text-center py-12 text-sm text-slate-500">
                      <EmptyState
                        icon={Lock}
                        title="No locked accounts"
                        description={
                          debouncedSearchTerm
                            ? 'No locked customer accounts match your search query.'
                            : 'All customer accounts are currently active.'
                        }
                      />
                    </Table.Cell>
                  </Table.Row>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      )}

      {totalItems > 0 && (
        <div className="px-5 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
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

      <UnlockCustomerModal
        isOpen={Boolean(unlockingCustomer)}
        customerName={
          unlockingCustomer
            ? `${unlockingCustomer.firstName || ''} ${unlockingCustomer.lastName || ''}`.trim()
            : ''
        }
        customerEmail={unlockingCustomer?.email}
        isSubmitting={isUnlocking}
        onConfirm={handleConfirmUnlock}
        onCancel={() => setUnlockingCustomer(null)}
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


