import { useState } from 'react'
import { X, Sparkles, History, Plus } from 'lucide-react'
import { useUiStore } from '@app/store/uiStore.js'
import ChatWindow from './ChatWindow.jsx'
import ChatSessionList from './ChatSessionList.jsx'
import { useCreateChatSession } from '@features/chat/hooks/useChatSession.js'

export default function ChatDrawer() {
  const { isChatDrawerOpen, closeChatDrawer } = useUiStore()
  const [showHistorySidebar, setShowHistorySidebar] = useState(false)
  const { mutate: createSession, isPending: isCreating } = useCreateChatSession()

  if (!isChatDrawerOpen) return null

  const handleNewChat = () => {
    createSession({})
    setShowHistorySidebar(false)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={closeChatDrawer}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl border-l border-slate-200/90 flex flex-col animate-slide-in-right">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-slate-200/80 bg-white px-4 py-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-xs">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-none">FeedInsight AI Assistant</h3>
                <span className="text-[11px] font-medium text-slate-400">Contextual PO Intelligence</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowHistorySidebar(!showHistorySidebar)}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                  showHistorySidebar
                    ? 'bg-brand-50 text-brand-700 border border-brand-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                title="Toggle session history"
              >
                <History size={14} /> History
              </button>

              <button
                type="button"
                onClick={handleNewChat}
                disabled={isCreating}
                className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-brand-600 to-indigo-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:from-brand-500 hover:to-indigo-500 transition-all"
                title="Start new chat"
              >
                <Plus size={14} /> New
              </button>

              <button
                type="button"
                onClick={closeChatDrawer}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors ml-1"
                aria-label="Close assistant drawer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Drawer Body: History Sidebar or Main Chat Window */}
          <div className="flex flex-1 overflow-hidden relative">
            {showHistorySidebar && (
              <ChatSessionList
                className="absolute inset-y-0 left-0 z-10 w-72 shadow-xl"
                onSelectSession={() => setShowHistorySidebar(false)}
              />
            )}
            <ChatWindow className="w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
