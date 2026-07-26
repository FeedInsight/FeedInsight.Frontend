import EmptyState from '@shared/components/ui/EmptyState.jsx'
import Spinner from '@shared/components/ui/Spinner.jsx'
import { MessageSquare } from 'lucide-react'
import MessageBubble from './MessageBubble.jsx'
import ChatInput from './ChatInput.jsx'
import { useChatMessages } from '@features/chat/hooks/useChatSession.js'
import { useSendMessage } from '@features/chat/hooks/useSendMessage.js'
import { useUiStore } from '@app/store/uiStore.js'

/**
 * Main conversational panel of the "AI Product Assistant" (README Flow 3).
 * Reads the active session id from uiStore -- see ChatSessionList for how
 * it's set. Shows an empty state prompting the admin to start/select a
 * conversation when nothing is active yet.
 */
export default function ChatWindow() {
  const { activeChatSessionId } = useUiStore()
  const { data: messages = [], isLoading } = useChatMessages(activeChatSessionId)
  const { mutate: sendMessage, isPending } = useSendMessage(activeChatSessionId)

  if (!activeChatSessionId) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="Select or start a conversation"
        description="Ask the AI Product Assistant about trends, duplicate reports, or backlog status."
        className="flex-1"
      />
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4 scrollbar-thin">
        {isLoading ? (
          <Spinner />
        ) : (
          messages.map((message) => <MessageBubble key={message.id} message={message} />)
        )}
      </div>
      <ChatInput onSend={sendMessage} isSending={isPending} />
    </div>
  )
}
