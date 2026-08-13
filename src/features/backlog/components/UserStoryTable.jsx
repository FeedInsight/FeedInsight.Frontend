import { useMemo, useState } from 'react'
import { Eye, Pencil, RefreshCw } from 'lucide-react'
import Table from '@shared/components/ui/Table.jsx'
import Button from '@shared/components/ui/Button.jsx'
import Badge from '@shared/components/ui/Badge.jsx'
import TablePagination from '@shared/components/ui/TablePagination.jsx'
import { STORY_STATUS_META } from '@shared/constants/statusEnums.js'
import UserStoryEditModal from './UserStoryEditModal.jsx'
import UserStoryDetailModal from './UserStoryDetailModal.jsx'

export default function UserStoryTable({
  rows = [],
  isLoading = false,
  page,
  pageSize,
  totalItems,
  onPageChange,
  onEdit,
  onSync,
  isSyncingId,
  isEditingId,
}) {
  const [selectedStory, setSelectedStory] = useState(null)
  const [editingStory, setEditingStory] = useState(null)

  const paginatedRows = useMemo(() => rows, [rows])
  const rangeStart = totalItems > 0 ? (page - 1) * pageSize + 1 : 0
  const rangeEnd = Math.min(page * pageSize, totalItems)
  const hasNextPage = page * pageSize < totalItems
  const hasPreviousPage = page > 1

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <Table>
        <Table.Head>
          <Table.Row className="bg-slate-50/80 border-b border-slate-200/80">
            <Table.Cell
              as="th"
              className="py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Story
            </Table.Cell>
            <Table.Cell
              as="th"
              className="py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Acceptance Criteria
            </Table.Cell>
            <Table.Cell
              as="th"
              className="py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Urgency
            </Table.Cell>
            <Table.Cell
              as="th"
              className="py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Status
            </Table.Cell>
            <Table.Cell
              as="th"
              className="py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right"
            >
              Actions
            </Table.Cell>
          </Table.Row>
        </Table.Head>

        <tbody className="divide-y divide-slate-100">
          {isLoading ? (
            <Table.Row>
              <Table.Cell colSpan={6} className="text-center py-12 text-sm text-slate-500">
                Loading stories...
              </Table.Cell>
            </Table.Row>
          ) : paginatedRows.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={6} className="text-center py-12 text-sm text-slate-500">
                No user stories found.
              </Table.Cell>
            </Table.Row>
          ) : (
            paginatedRows.map((story) => {
              const statusMeta = STORY_STATUS_META[story.status]
              const canEdit = story.source === 'FeedInsight' && story.status !== 'Synced'
              const canSync = story.source === 'FeedInsight' && story.status !== 'Synced'

              return (
                <Table.Row
                  key={story.id}
                  className="hover:bg-slate-50/60 transition-colors align-top"
                >
                  <Table.Cell className="py-3 font-semibold text-slate-900 text-sm max-w-[220px] whitespace-pre-wrap">
                    {story.title || '—'}
                  </Table.Cell>
                  <Table.Cell className="py-3 text-slate-600 text-sm max-w-[300px] whitespace-pre-wrap">
                    {story.acceptanceCriteria || '—'}
                  </Table.Cell>
                  <Table.Cell className="py-3 text-slate-600 text-sm">
                    {story.urgencyScore ?? '—'}
                  </Table.Cell>
                  <Table.Cell className="py-3">
                    {statusMeta ? (
                      <Badge className={statusMeta.badgeClass}>{statusMeta.label}</Badge>
                    ) : (
                      <Badge className="bg-slate-100 text-slate-600">
                        {story.status || 'Unknown'}
                      </Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="xs"
                        onClick={() => setSelectedStory(story)}
                        title="View details"
                      >
                        <Eye size={14} />
                      </Button>

                      <Button
                        variant="secondary"
                        size="xs"
                        onClick={() => setEditingStory(story)}
                        disabled={!canEdit || isEditingId === story.id}
                        title={
                          !canEdit
                            ? 'Edit is only allowed for FeedInsight stories that are not synced'
                            : 'Edit story'
                        }
                        isLoading={isEditingId === story.id}
                      >
                        <Pencil size={14} />
                        <span>Edit</span>
                      </Button>

                      <Button
                        variant={canSync ? 'primary' : 'secondary'}
                        size="xs"
                        onClick={() => onSync(story.id)}
                        disabled={!canSync || isSyncingId === story.id}
                        isLoading={isSyncingId === story.id}
                        loadingText="Syncing..."
                        title={
                          !canSync
                            ? 'Sync is only allowed for FeedInsight stories that are not synced'
                            : 'Sync to Jira'
                        }
                        className={
                          !canSync
                            ? 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-100 hover:text-slate-400'
                            : ''
                        }
                      >
                        <RefreshCw size={14} />
                        <span>Sync</span>
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              )
            })
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
            onNext={() => onPageChange(page + 1)}
            onPrevious={() => onPageChange(Math.max(page - 1, 1))}
            isLoading={isLoading}
          />
        </div>
      )}

      <UserStoryDetailModal
        isOpen={Boolean(selectedStory)}
        onClose={() => setSelectedStory(null)}
        story={selectedStory}
      />

      <UserStoryEditModal
        isOpen={Boolean(editingStory)}
        onClose={() => setEditingStory(null)}
        story={editingStory}
        isSubmitting={Boolean(isEditingId && editingStory?.id === isEditingId)}
        onSave={onEdit}
      />
    </div>
  )
}
