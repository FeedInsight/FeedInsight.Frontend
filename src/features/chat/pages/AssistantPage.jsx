import ChatSessionList from '@features/chat/components/ChatSessionList.jsx'
import ChatWindow from '@features/chat/components/ChatWindow.jsx'

/** Top-level page composing the two chat panels. No data-fetching here --
 * both children own their own React Query hooks. */
export default function AssistantPage() {
  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-xl border border-slate-200 bg-white">
      <ChatSessionList />
      <ChatWindow />
    </div>
  )
}
