import { Sparkles, Bot } from 'lucide-react'
import ChatSessionList from '@features/chat/components/ChatSessionList.jsx'
import ChatWindow from '@features/chat/components/ChatWindow.jsx'

/**
 * Top-level Dedicated Page for the AI Product Assistant & Conversational Memory.
 * Executive header + ChatGPT-style Master-Detail session history layout.
 */
export default function AssistantPage() {
  return (
    <div className="flex flex-col gap-5 h-[calc(100vh-6rem)]">
      {/* Executive Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-3 shrink-0">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              AI Product Assistant
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-50 to-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700 border border-brand-200/80 shadow-2xs">
              <Sparkles size={12} className="text-brand-600 animate-pulse" />
              GPT-4o mini via Semantic Kernel
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Query conversational intelligence across Qdrant vector embeddings and SQL databases to
            discover backlog trends, user sentiment, and duplicate feedback.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 rounded-xl bg-slate-900 text-white px-3 py-1.5 shadow-2xs">
            <Bot size={15} className="text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Main Master-Detail Container */}
      <div className="flex flex-1 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
        <ChatSessionList />
        <ChatWindow />
      </div>
    </div>
  )
}
