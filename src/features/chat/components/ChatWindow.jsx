import { useEffect, useRef, useState, useMemo } from 'react'
import EmptyState from '@shared/components/ui/EmptyState.jsx'
import Spinner from '@shared/components/ui/Spinner.jsx'
import { MessageSquare, Sparkles, RefreshCw, Trash2 } from 'lucide-react'
import MessageBubble from './MessageBubble.jsx'
import ChatInput from './ChatInput.jsx'
import TypingIndicator from './TypingIndicator.jsx'
import DeleteChatModal from './DeleteChatModal.jsx'
import {
  useChatMessages,
  useCreateChatSession,
  useClearChatSession,
} from '@features/chat/hooks/useChatSession.js'
import { useSendMessage } from '@features/chat/hooks/useSendMessage.js'
import { useUiStore } from '@app/store/uiStore.js'
import Button from '@shared/components/ui/Button.jsx'

/**
 * Main Conversational Window of the AI Product Assistant.
 * Tracks active SessionId, renders message history, handles LLM loading state
 * with TypingIndicator, and appends user message & AI reply.
 */
export default function ChatWindow({ className }) {
  const { activeChatSessionId, setActiveChatSessionId } = useUiStore()
  const { data: rawMessages, isLoading, refetch } = useChatMessages(activeChatSessionId)
  const {
    mutate: sendMessage,
    isPending,
    variables: pendingUserContent,
  } = useSendMessage(activeChatSessionId)
  const { mutate: createSession, isPending: isCreating } = useCreateChatSession()
  const { mutate: clearSession, isPending: isDeleting } = useClearChatSession()

  const messagesEndRef = useRef(null)
  const [localPendingMessage, setLocalPendingMessage] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // Safely extract messages array
  const messages = useMemo(() => {
    return Array.isArray(rawMessages)
      ? rawMessages
      : Array.isArray(rawMessages?.items)
        ? rawMessages.items
        : Array.isArray(rawMessages?.data)
          ? rawMessages.data
          : Array.isArray(rawMessages?.messages)
            ? rawMessages.messages
            : Array.isArray(rawMessages?.$values)
              ? rawMessages.$values
              : []
  }, [rawMessages])

  // Scroll to bottom whenever messages update or pending state changes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isPending, localPendingMessage])

  // Clear local pending message when sending finishes
  useEffect(() => {
    if (!isPending) {
      setLocalPendingMessage(null)
    }
  }, [isPending])

  const handleSendMessage = (text) => {
    if (!text) return

    // If no active session, create one first, then send
    if (!activeChatSessionId) {
      createSession(
        {},
        {
          onSuccess: (newSession) => {
            setLocalPendingMessage(text)
            sendMessage(text)
          },
        },
      )
      return
    }

    setLocalPendingMessage(text)
    sendMessage(text)
  }

  const handleConfirmClearSession = () => {
    if (!activeChatSessionId) return
    clearSession(activeChatSessionId, {
      onSuccess: () => {
        setActiveChatSessionId(null)
        setIsDeleteModalOpen(false)
      },
      onError: () => {
        setIsDeleteModalOpen(false)
      },
    })
  }

  // 1. No Active Session selected state
  if (!activeChatSessionId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6 bg-slate-50/50">
        <div className="flex max-w-md flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-md">
            <Sparkles size={28} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">AI Product Assistant</h2>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            Ask about customer feedback trends, duplicate feature requests, or backlog priorities. I
            inspect vector context from Qdrant and SQL.
          </p>

          <Button
            isLoading={isCreating}
            onClick={() => createSession({})}
            size="md"
            className="mt-6 gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 shadow-sm"
          >
            <Sparkles size={16} /> Start New Conversation
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-1 flex-col bg-slate-50/30 overflow-hidden ${className || ''}`}>
      {/* Chat Sub-Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 bg-white px-4 py-2.5 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <MessageSquare size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900">Active Conversation</span>
            <span className="text-[10px] font-mono text-slate-400">ID: {activeChatSessionId}</span>
          </div>
        </div>
      </div>

      {/* Chat Thread Area */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6 scrollbar-thin">
        {isLoading ? (
          <div className="flex h-full flex-col items-center justify-center py-12">
            <Spinner />
            <span className="mt-2 text-xs text-slate-400">Loading conversation history…</span>
          </div>
        ) : messages.length === 0 && !isPending && !localPendingMessage ? (
          <div className="flex h-full flex-col items-center justify-center text-center py-12">
            <EmptyState
              icon={Sparkles}
              title="How can I assist your Product Backlog today?"
              description="Type a question below or pick a prompt starter to query customer feedback trends and AI backlog stories."
            />
          </div>
        ) : (
          <>
            {/* Render Historical Messages */}
            {messages.map((message, idx) => (
              <MessageBubble key={message.id || idx} message={message} />
            ))}

            {/* Render Optimistic User Question while pending */}
            {isPending && (localPendingMessage || pendingUserContent) && (
              <MessageBubble
                message={{
                  role: 'user',
                  senderRole: 'User',
                  content: localPendingMessage || pendingUserContent,
                  createdAt: new Date().toISOString(),
                }}
              />
            )}

            {/* Render AI Typing Indicator while pending */}
            {isPending && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Chat Input Field */}
      <ChatInput
        onSend={handleSendMessage}
        isSending={isPending}
        showSuggestions={messages.length < 3}
      />

      {/* Confirmation Modal */}
      <DeleteChatModal
        isOpen={isDeleteModalOpen}
        sessionTitle={`Conversation ${activeChatSessionId}`}
        isDeleting={isDeleting}
        onConfirm={handleConfirmClearSession}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  )
}
