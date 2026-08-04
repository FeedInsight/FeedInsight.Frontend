import { useState } from 'react'
import { Sparkles, User, Copy, Check } from 'lucide-react'
import { cn } from '@shared/utils/classNames.js'
import { CHAT_SENDER_ROLE } from '@app/config/constants.js'
import MarkdownRenderer from '@shared/components/ui/MarkdownRenderer.jsx'

export default function MessageBubble({ message }) {
  const [copied, setCopied] = useState(false)
  const isUser = message.senderRole === CHAT_SENDER_ROLE.USER || message.role === 'user'

  const handleCopy = () => {
    if (!message?.content) return
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'group flex w-full items-start gap-3 py-1',
        isUser ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      {/* Avatar Icon */}
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold shadow-2xs',
          isUser
            ? 'bg-slate-800 text-white'
            : 'bg-gradient-to-tr from-brand-600 to-indigo-600 text-white',
        )}
      >
        {isUser ? <User size={16} /> : <Sparkles size={16} />}
      </div>

      {/* Message Content Bubble */}
      <div className={cn('flex max-w-[85%] flex-col', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'relative rounded-2xl px-4 py-3 text-sm shadow-2xs transition-all',
            isUser
              ? 'rounded-tr-xs bg-gradient-to-r from-brand-600 to-indigo-600 text-white'
              : 'rounded-tl-xs border border-slate-200/90 bg-white text-slate-800',
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}

          {/* Copy Message Action Button */}
          <button
            onClick={handleCopy}
            className={cn(
              'absolute -top-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-md p-1 bg-white border border-slate-200 shadow-xs hover:bg-slate-50 text-slate-500',
              isUser ? '-left-2' : '-right-2',
            )}
            title="Copy message"
            type="button"
          >
            {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
          </button>
        </div>
      </div>
    </div>
  )
}
