import { useState, useMemo } from 'react'
import { Plus, MessageSquare, Trash2, Search, Sparkles } from 'lucide-react'
import Button from '@shared/components/ui/Button.jsx'
import EmptyState from '@shared/components/ui/EmptyState.jsx'
import DeleteChatModal from './DeleteChatModal.jsx'
import { cn } from '@shared/utils/classNames.js'
import {
  useChatSessions,
  useCreateChatSession,
  useClearChatSession,
  generateTitleFromMessage,
} from '@features/chat/hooks/useChatSession.js'
import { useUiStore } from '@app/store/uiStore.js'
import { isToday, isYesterday, subDays, isAfter, parseISO } from 'date-fns'

/**
 * Group sessions chronologically into Today, Yesterday, Previous 7 Days, and Older.
 */
function groupSessionsByDate(sessions) {
  const groups = {
    today: [],
    yesterday: [],
    previous7Days: [],
    older: [],
  }

  const now = new Date()
  const sevenDaysAgo = subDays(now, 7)

  sessions.forEach((session) => {
    if (!session.createdAt) {
      groups.today.push(session)
      return
    }

    const date =
      typeof session.createdAt === 'string'
        ? parseISO(session.createdAt)
        : new Date(session.createdAt)

    if (isToday(date)) {
      groups.today.push(session)
    } else if (isYesterday(date)) {
      groups.yesterday.push(session)
    } else if (isAfter(date, sevenDaysAgo)) {
      groups.previous7Days.push(session)
    } else {
      groups.older.push(session)
    }
  })

  return groups
}

/**
 * ChatGPT-style Chat Session Sidebar listing historical conversations.
 */
export default function ChatSessionList({ className, onSelectSession }) {
  const { data: rawSessions, isLoading } = useChatSessions()
  const { activeChatSessionId, setActiveChatSessionId } = useUiStore()
  const { mutate: createSession, isPending: isCreating } = useCreateChatSession()
  const { mutate: clearSession, isPending: isDeleting } = useClearChatSession()

  const [searchTerm, setSearchTerm] = useState('')
  const [sessionToDelete, setSessionToDelete] = useState(null)

  // Extract raw sessions array safely
  const sessions = useMemo(() => {
    const list = Array.isArray(rawSessions)
      ? rawSessions
      : Array.isArray(rawSessions?.items)
        ? rawSessions.items
        : Array.isArray(rawSessions?.data)
          ? rawSessions.data
          : Array.isArray(rawSessions?.$values)
            ? rawSessions.$values
            : []

    // Sort by createdAt descending (newest first)
    return [...list].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })
  }, [rawSessions])

  // Filter by search term
  const filteredSessions = useMemo(() => {
    if (!searchTerm.trim()) return sessions
    return sessions.filter((s) =>
      (s.title || 'New Conversation').toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [sessions, searchTerm])

  const grouped = useMemo(() => groupSessionsByDate(filteredSessions), [filteredSessions])

  const handleStartNewChat = () => {
    createSession(
      {},
      {
        onSuccess: (newSession) => {
          const newId =
            newSession?.id ||
            newSession?.data?.id ||
            (Array.isArray(newSession?.items) ? newSession.items[0]?.id : null) ||
            (typeof newSession === 'string' ? newSession : null)

          if (newId) {
            setActiveChatSessionId(newId)
            if (onSelectSession) onSelectSession(newId)
          }
        },
      },
    )
  }

  const handleSelect = (id) => {
    setActiveChatSessionId(id)
    if (onSelectSession) onSelectSession(id)
  }

  const handleOpenDeleteModal = (e, session) => {
    e.stopPropagation()
    setSessionToDelete(session)
  }

  const handleConfirmDelete = () => {
    if (!sessionToDelete) return
    const idToDelete = sessionToDelete.id
    clearSession(idToDelete, {
      onSuccess: () => {
        if (activeChatSessionId === idToDelete) {
          setActiveChatSessionId(null)
        }
        setSessionToDelete(null)
      },
      onError: () => {
        setSessionToDelete(null)
      },
    })
  }

  const getDisplayTitle = (session) => {
    if (
      session.title &&
      session.title !== 'Untitled conversation' &&
      session.title !== 'Untitled'
    ) {
      return session.title
    }
    if (session.firstMessage) {
      return generateTitleFromMessage(session.firstMessage)
    }
    return 'New Conversation'
  }

  const renderGroup = (title, items) => {
    if (items.length === 0) return null

    return (
      <div key={title} className="mb-4">
        <h4 className="mb-1.5 px-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {title}
        </h4>
        <ul className="flex flex-col gap-1">
          {items.map((session) => {
            const isActive = activeChatSessionId === session.id
            const displayTitle = getDisplayTitle(session)
            return (
              <li key={session.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(session.id)}
                  className={cn(
                    'group relative flex w-full items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-left text-xs transition-all',
                    isActive
                      ? 'bg-brand-50/90 text-brand-700 font-bold border-l-4 border-brand-600 shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium',
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <MessageSquare
                      size={14}
                      className={cn(
                        'shrink-0',
                        isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600',
                      )}
                    />
                    <span className="truncate">{displayTitle}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleOpenDeleteModal(e, session)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 transition-opacity rounded"
                    title="Delete conversation"
                  >
                    <Trash2 size={13} />
                  </button>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  return (
    <>
      <aside
        className={cn('flex w-72 flex-col border-r border-slate-200/80 bg-white p-3.5', className)}
      >
        {/* Sidebar Header & New Chat Button */}
        <div className="flex flex-col gap-3 pb-3 border-b border-slate-200/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Sparkles size={16} />
              </div>
              <span className="text-sm font-bold text-slate-900">Chat History</span>
            </div>
          </div>

          <Button
            size="sm"
            isLoading={isCreating}
            onClick={handleStartNewChat}
            className="w-full justify-center rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-xs hover:from-brand-500 hover:to-indigo-500"
          >
            <Plus size={16} /> New Chat
          </Button>

          {/* Search filter for historical chats */}
          {sessions.length > 3 && (
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search history…"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:border-brand-500 focus:bg-white focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Session History Chronological List */}
        <div className="flex-1 overflow-y-auto pt-3 scrollbar-thin">
          {isLoading ? (
            <div className="flex items-center justify-center p-6 text-xs text-slate-400">
              Loading conversations…
            </div>
          ) : filteredSessions.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title={searchTerm ? 'No matching chats' : 'No history yet'}
              description={
                searchTerm
                  ? 'Try a different search keyword.'
                  : 'Click "New Chat" above to start your first conversation.'
              }
              className="py-8"
            />
          ) : (
            <>
              {renderGroup('Today', grouped.today)}
              {renderGroup('Yesterday', grouped.yesterday)}
              {renderGroup('Previous 7 Days', grouped.previous7Days)}
              {renderGroup('Older', grouped.older)}
            </>
          )}
        </div>
      </aside>

      {/* Confirmation Modal */}
      <DeleteChatModal
        isOpen={Boolean(sessionToDelete)}
        sessionTitle={sessionToDelete ? getDisplayTitle(sessionToDelete) : ''}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setSessionToDelete(null)}
      />
    </>
  )
}
