import { Plus, MessageSquare } from 'lucide-react'
import Button from '@shared/components/ui/Button.jsx'
import EmptyState from '@shared/components/ui/EmptyState.jsx'
import { cn } from '@shared/utils/classNames.js'
import { useChatSessions, useCreateChatSession } from '@features/chat/hooks/useChatSession.js'
import { useUiStore } from '@app/store/uiStore.js'

/**
 * Left rail of the AI Product Assistant screen listing CHATSESSIONS rows.
 * "New chat" creates a session and auto-selects it (see
 * useCreateChatSession). Selection state lives in uiStore, not local state,
 * so ChatWindow (a sibling component) can react to it.
 */
export default function ChatSessionList() {
  const { data: rawSessions } = useChatSessions()
  const { activeChatSessionId, setActiveChatSessionId } = useUiStore()
  const { mutate: createSession, isPending } = useCreateChatSession()

  const sessions = Array.isArray(rawSessions)
    ? rawSessions
    : Array.isArray(rawSessions?.items)
    ? rawSessions.items
    : Array.isArray(rawSessions?.data)
    ? rawSessions.data
    : Array.isArray(rawSessions?.$values)
    ? rawSessions.$values
    : []

  return (
    <div className="flex w-64 flex-col gap-2 border-r border-slate-200 p-3">
      <Button size="sm" isLoading={isPending} onClick={() => createSession({})}>
        <Plus size={16} /> New chat
      </Button>

      {sessions.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No conversations yet" />
      ) : (
        <ul className="flex flex-col gap-1 overflow-y-auto scrollbar-thin">
          {sessions.map((session) => (
            <li key={session.id}>
              <button
                onClick={() => setActiveChatSessionId(session.id)}
                className={cn(
                  'w-full truncate rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100',
                  activeChatSessionId === session.id && 'bg-brand-50 text-brand-700',
                )}
              >
                {session.title || 'Untitled conversation'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
