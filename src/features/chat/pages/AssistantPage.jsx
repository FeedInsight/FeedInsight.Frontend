import ChatSessionList from '@features/chat/components/ChatSessionList.jsx'
import ChatWindow from '@features/chat/components/ChatWindow.jsx'

export default function AssistantPage() {
  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-xl border border-slate-200 bg-white">
      <ChatSessionList />
      <ChatWindow />
    </div>
  )
}
