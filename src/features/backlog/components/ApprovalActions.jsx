import { useState } from 'react'
import Button from '@shared/components/ui/Button.jsx'
import { useApproveStory } from '@features/backlog/hooks/useApproveStory.js'

/**
 * Terminal action bar for StoryDetailPage: Approve / Reject / Publish to
 * Jira. `getEditedFields` is a callback returning whatever the reviewer
 * changed in AcceptanceCriteriaEditor, sent as the approve payload.
 * Publish is only enabled once status === 'Approved' (see disabled logic
 * driven by the `status` prop passed from StoryDetailPage).
 */
export default function ApprovalActions({ storyId, status, getEditedFields }) {
  const { approve, reject, publish } = useApproveStory(storyId)
  const [rejectReason, setRejectReason] = useState('')

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Button
          isLoading={approve.isPending}
          disabled={status !== 'Draft'}
          onClick={() => approve.mutate(getEditedFields())}
        >
          Approve
        </Button>
        <Button
          variant="danger"
          isLoading={reject.isPending}
          disabled={status !== 'Draft'}
          onClick={() => reject.mutate(rejectReason)}
        >
          Reject
        </Button>
        <Button
          variant="secondary"
          isLoading={publish.isPending}
          disabled={status !== 'Approved'}
          onClick={() => publish.mutate()}
        >
          Publish to Jira
        </Button>
      </div>
      <input
        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-500"
        placeholder="Optional reason if rejecting…"
        value={rejectReason}
        onChange={(e) => setRejectReason(e.target.value)}
      />
    </div>
  )
}
