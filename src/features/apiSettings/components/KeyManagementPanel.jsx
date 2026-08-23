import Spinner from "@shared/components/ui/Spinner"
import { useApiKeys } from "../hooks/useAPIKeys"
import { AlertCircle, Ban, KeyRound, Calendar, Hash } from "lucide-react"
import Table from "@shared/components/ui/Table"
import Badge from "@shared/components/ui/Badge"
import EmptyState from "@shared/components/ui/EmptyState"
import Button from "@shared/components/ui/Button"
import TablePagination from "@shared/components/ui/TablePagination"
import RevokeApiKeyModal from "./RevokeApiKeyModal"
import { useState } from "react"

function formatDate(dateString) {
  if (!dateString) {
    return '—'
  }

  return new Date(dateString).toLocaleDateString('en-US', { dateStyle: 'medium' })
}

export default function KeyManagementPanel() {
  const { data, isLoading, isError, error } = useApiKeys()
  const [selectedKey, setSelectedKey] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 10

  const keys = data?.data ?? []

  const totalItems = keys.length
  const paginatedKeys = keys.slice((page - 1) * pageSize, page * pageSize)
  const rangeStart = totalItems > 0 ? (page - 1) * pageSize + 1 : 0
  const rangeEnd = Math.min(page * pageSize, totalItems)
  const hasNextPage = page * pageSize < totalItems
  const hasPreviousPage = page > 1

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 bg-white rounded-2xl border border-slate-200/80">
        <Spinner size={24} className="text-brand-600" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3.5 text-sm text-red-700 shadow-xs">
        <AlertCircle size={18} className="shrink-0 text-red-500" />
        <span>{error?.message || 'Failed to load API keys. Please try again.'}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {keys.length === 0 ? (
          <div className="py-12 text-center">
            <EmptyState
              icon={KeyRound}
              title="No API keys generated"
              description="Generate an API key to securely ingest feedback into FeedInsight."
            />
          </div>
        ) : (
          <Table>
            <Table.Head>
              <Table.Row className="bg-slate-50/80 border-b border-slate-200/80">
                <Table.Cell as="th" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Name</Table.Cell>
                <Table.Cell as="th" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Key Identifier</Table.Cell>
                <Table.Cell as="th" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</Table.Cell>
                <Table.Cell as="th" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Created At</Table.Cell>
                <Table.Cell as="th" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Expires At</Table.Cell>
                <Table.Cell as="th" className="py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Actions</Table.Cell>
              </Table.Row>
            </Table.Head>
            <tbody className="divide-y divide-slate-100">
              {paginatedKeys.map((key) => {
                const isActive = Boolean(key.isActive)
                return (
                  <Table.Row key={key.id} className="hover:bg-slate-50/60 transition-colors">
                    <Table.Cell className="py-3 font-semibold text-slate-900 text-sm">
                      {key.name ?? '—'}
                    </Table.Cell>

                    <Table.Cell className="py-3">
                      <code className="inline-flex items-center gap-1 font-mono text-xs text-slate-600 bg-slate-100/90 px-2.5 py-1 rounded-md border border-slate-200/60">
                        <Hash size={11} className="text-slate-400" />
                        {key.prefix ? `${key.prefix}...` : '—'}
                      </code>
                    </Table.Cell>

                    <Table.Cell className="py-3">
                      <Badge
                        className={
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 font-semibold px-2.5 py-1'
                            : 'bg-slate-100 text-slate-500 font-medium px-2.5 py-1'
                        }
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </Table.Cell>

                    <Table.Cell className="py-3 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-400" />
                        <span>{formatDate(key.createdAt)}</span>
                      </div>
                    </Table.Cell>

                    <Table.Cell className="py-3 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-400" />
                        <span>{formatDate(key.expiresAt)}</span>
                      </div>
                    </Table.Cell>

                    <Table.Cell className="py-3 text-right">
                      {isActive && (
                        <Button
                          variant="danger"
                          size="xs"
                          title="Revoke key"
                          onClick={() => {
                            setSelectedKey(key)
                            setIsModalOpen(true)
                          }}
                        >
                          <Ban size={14} />
                          <span>Revoke</span>
                        </Button>
                      )}
                    </Table.Cell>
                  </Table.Row>
                )
              })}
            </tbody>
          </Table>
        )}

        {totalItems > 0 && (
          <div className="px-5 border-t border-slate-100 bg-slate-50/40">
            <TablePagination
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              totalItems={totalItems}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              onNext={() => setPage((p) => p + 1)}
              onPrevious={() => setPage((p) => Math.max(p - 1, 1))}
            />
          </div>
        )}
      </div>

      <RevokeApiKeyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedKey(null)
        }}
        apiKey={selectedKey}
      />
    </div>
  )
}

