import { Bot } from 'lucide-react'
import ChatSessionList from '@features/chat/components/ChatSessionList.jsx'
import ChatWindow from '@features/chat/components/ChatWindow.jsx'
import PageHeader from '@shared/components/ui/PageHeader'

export default function AssistantPage() {
  return (
    <div className="flex flex-col gap-5 h-[calc(100vh-6rem)]">
      <PageHeader
        title="AI Product Assistant"
        description="Query conversational intelligence across Qdrant vector embeddings and SQL databases to discover backlog trends, user sentiment, and duplicate feedback."
      >
        <div className="flex items-center gap-2 rounded-xl bg-slate-900 text-white px-3 py-1.5 shadow-2xs">
          <Bot size={15} className="text-indigo-400" />
        </div>
      </PageHeader>

      <div className="flex flex-1 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
        <ChatSessionList />
        <ChatWindow />
      </div>
    </div>
  )
}
