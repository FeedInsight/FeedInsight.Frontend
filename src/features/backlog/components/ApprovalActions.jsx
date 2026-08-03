import { useState } from 'react'
import Button from '@shared/components/ui/Button.jsx'
import { useApproveStory } from '@features/backlog/hooks/useApproveStory.js'
import { CheckCircle, XCircle, Send } from 'lucide-react'

/**
 * Terminal action bar for StoryDetailPage: Approve / Reject / Publish to
 * Jira. `getEditedFields` is a callback returning whatever the reviewer
 * changed in AcceptanceCriteriaEditor, sent as the approve payload.
 */
export default function ApprovalActions({ storyId, status, getEditedFields }) {
  const { approve, reject, publish } = useApproveStory(storyId)
  const [rejectReason, setRejectReason] = useState('')

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2.5">
        <Button
          variant="success"
          size="md"
          isLoading={approve.isPending}
          disabled={status !== 'Draft'}
          onClick={() => approve.mutate(getEditedFields())}
          className="shadow-md shadow-emerald-500/20"
        >
          <CheckCircle size={16} />
          <span>Approve Story</span>
        </Button>
        <Button
          variant="danger"
          size="md"
          isLoading={reject.isPending}
          disabled={status !== 'Draft'}
          onClick={() => reject.mutate(rejectReason)}
          className="shadow-md shadow-red-500/20"
        >
          <XCircle size={16} />
          <span>Reject Story</span>
        </Button>
        <Button
          variant="primary"
          size="md"
          isLoading={publish.isPending}
          disabled={status !== 'Approved'}
          onClick={() => publish.mutate()}
          className="shadow-md shadow-brand-500/20"
        >
          <Send size={16} />
          <span>Publish to Jira</span>
        </Button>
      </div>
      <input
        className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-600 bg-white shadow-xs focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
        placeholder="Optional reason if rejecting…"
        value={rejectReason}
        onChange={(e) => setRejectReason(e.target.value)}
      />
    </div>
  )
}

