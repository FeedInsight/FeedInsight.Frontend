import { useState } from 'react'
import { Send } from 'lucide-react'
import Button from '@shared/components/ui/Button.jsx'

export default function ChatInput({ onSend, isSending }) {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!value.trim()) return
    onSend(value.trim())
    setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 border-t border-slate-200 p-3">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask about your backlog, trends, or duplicates…"
        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
      />
      <Button type="submit" isLoading={isSending}>
        <Send size={16} />
      </Button>
    </form>
  )
}
