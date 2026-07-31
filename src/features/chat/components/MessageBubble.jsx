import { cn } from '@shared/utils/classNames.js'
import { CHAT_SENDER_ROLE } from '@app/config/constants.js'
import { formatRelative } from '@shared/utils/formatDate.js'

export default function MessageBubble({ message }) {
  const isUser = message.senderRole === CHAT_SENDER_ROLE.USER

  return (
    <div className={cn('flex flex-col', isUser ? 'items-end' : 'items-start')}>
      <div
        className={cn(
          'max-w-lg rounded-xl px-4 py-2 text-sm',
          isUser ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-800',
        )}
      >
        {message.content}
      </div>
      <span className="mt-1 text-xs text-slate-400">{formatRelative(message.createdAt)}</span>
    </div>
  )
}
