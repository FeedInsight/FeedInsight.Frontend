import Spinner from "@shared/components/ui/Spinner"
import { useApiKeys } from "../hooks/useAPIKeys"
import { AlertCircle, KeyRound } from "lucide-react"
import Table from "@shared/components/ui/Table"
import Badge from "@shared/components/ui/Badge"
import EmptyState from "@shared/components/ui/EmptyState"

function formatDate(dateString) {
  if (!dateString) {
    return '—'
  }

  return new Date(dateString).toLocaleDateString('en-US', { dateStyle: 'medium' })
}

export default function KeyManagementPanel() {
  const { data, isLoading, isError, error } = useApiKeys()

  const keys = data?.data ?? []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mt-4">
        <AlertCircle size={18} />
        <span>{error?.message || 'Failed to load API keys. Please try again.'}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Cell as="th">Name</Table.Cell>
            <Table.Cell as="th">Key</Table.Cell>
            <Table.Cell as="th">Status</Table.Cell>
            <Table.Cell as="th">Created At</Table.Cell>
            <Table.Cell as="th">Expires At</Table.Cell>
          </Table.Row>
        </Table.Head>
        <tbody>
          {keys.length > 0 ? (
            keys.map((key) => (
              <Table.Row key={key.id}>
                <Table.Cell className="font-medium text-slate-900">
                  {key.name ?? '—'}
                </Table.Cell>

                <Table.Cell>
                  <code className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-700">
                    {key.prefix ? `${key.prefix}...` : '—'}
                  </code>
                </Table.Cell>

                <Table.Cell>
                  <Badge
                    className={
                      key.isActive
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }
                  >
                    {key.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </Table.Cell>

                <Table.Cell className="text-sm text-slate-500">
                  {formatDate(key.createdAt)}
                </Table.Cell>

                <Table.Cell className="text-sm text-slate-500">
                  {formatDate(key.expiresAt)}
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={5} className="py-2">
                <EmptyState
                  icon={KeyRound}
                  title="No API keys yet"
                  description="Generate your first key"
                />
              </Table.Cell>
            </Table.Row>
          )}
        </tbody>
      </Table>
    </div>
  )
}
