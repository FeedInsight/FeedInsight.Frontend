import { Sparkles } from 'lucide-react'

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 my-2 animate-fade-in">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-xs">
        <Sparkles size={16} className="animate-pulse" />
      </div>
      <div className="flex items-center gap-2 rounded-2xl rounded-tl-xs border border-slate-200/90 bg-white px-4 py-3 shadow-2xs">
        <span className="text-xs font-semibold text-slate-500">FeedInsight AI is thinking</span>
        <div className="flex items-center gap-1 pl-1">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-bounce [animation-delay:-0.3s]"></span>
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-bounce [animation-delay:-0.15s]"></span>
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-bounce"></span>
        </div>
      </div>
    </div>
  )
}
