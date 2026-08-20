import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, CornerDownLeft } from 'lucide-react'
import Button from '@shared/components/ui/Button.jsx'

const PROMPT_SUGGESTIONS = [
  'Summarize top customer feature requests',
  'Find duplicate complaints about performance',
  'Which backlog stories are ready for Jira export?',
  'Analyze recent negative sentiment trends',
]

export default function ChatInput({ onSend, isSending, showSuggestions = true }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  // Auto-adjust height of textarea up to 140px
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`
    }
  }, [value])

  const handleSubmit = (e) => {
    if (e) e.preventDefault()
    if (!value.trim() || isSending) return
    onSend(value.trim())
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSelectSuggestion = (promptText) => {
    if (isSending) return
    onSend(promptText)
  }

  return (
    <div className="flex flex-col gap-2 border-t border-slate-200/90 bg-white p-3 sm:p-4 dark:border-slate-800 dark:bg-slate-900">
      {/* Quick Prompt Starter Chips */}
      {showSuggestions && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
          <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 pr-1">
            <Sparkles size={12} className="text-brand-500" /> Prompts:
          </span>
          {PROMPT_SUGGESTIONS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isSending}
              onClick={() => handleSelectSuggestion(prompt)}
              className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 transition-colors disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-brand-950/60"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your backlog, customer feedback, or duplicate reports…"
            disabled={isSending}
            className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-100 disabled:opacity-60 transition-all scrollbar-thin max-h-36 pr-10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-800 dark:disabled:bg-slate-900"
          />
          <div className="absolute right-3 bottom-3 hidden sm:flex items-center text-[10px] font-medium text-slate-400">
            <CornerDownLeft size={10} className="mr-0.5" /> Send
          </div>
        </div>

        <Button
          type="submit"
          isLoading={isSending}
          disabled={!value.trim() || isSending}
          size="md"
          className="rounded-xl px-4 py-2.5 shadow-sm"
        >
          <Send size={16} />
        </Button>
      </form>
    </div>
  )
}
