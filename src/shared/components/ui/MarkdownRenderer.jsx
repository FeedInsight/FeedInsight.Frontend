import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@shared/utils/classNames.js'

/**
 * Custom CodeBlock component with copy to clipboard functionality.
 */
function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-md">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-1.5 text-xs text-slate-400">
        <span className="font-mono font-medium text-slate-300">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded-md px-2 py-0.5 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          type="button"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check size={13} className="text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-xs font-mono text-slate-100 scrollbar-thin leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  )
}

/**
 * Format inline markdown text (bold, italic, inline code, links).
 */
function formatInlineText(text) {
  if (!text) return null

  // Split by inline elements: code, bold, italic, links
  const parts = []
  let lastIndex = 0

  // Regex pattern for inline formatting
  // Matches: `code`, **bold**, *italic*, [link](url)
  const regex = /(`([^`]+)`)|\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\)/g
  let match

  while ((match = regex.exec(text)) !== null) {
    const matchIndex = match.index

    // Append text before match
    if (matchIndex > lastIndex) {
      parts.push(text.slice(lastIndex, matchIndex))
    }

    if (match[1]) {
      // Inline code
      parts.push(
        <code
          key={matchIndex}
          className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs font-semibold text-indigo-700 border border-slate-200/80"
        >
          {match[2]}
        </code>
      )
    } else if (match[3]) {
      // Bold
      parts.push(
        <strong key={matchIndex} className="font-bold text-slate-900">
          {match[3]}
        </strong>
      )
    } else if (match[4]) {
      // Italic
      parts.push(
        <em key={matchIndex} className="italic text-slate-800">
          {match[4]}
        </em>
      )
    } else if (match[5] && match[6]) {
      // Link
      parts.push(
        <a
          key={matchIndex}
          href={match[6]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand-600 hover:text-brand-700 underline underline-offset-2"
        >
          {match[5]}
        </a>
      )
    }

    lastIndex = regex.lastIndex
  }

  // Append remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : text
}

/**
 * Lightweight, safe Markdown renderer for AI Assistant responses.
 */
export default function MarkdownRenderer({ content, className }) {
  if (!content) return null

  // Process code blocks first: ```lang ... ```
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g
  const blocks = []
  let lastIndex = 0
  let match

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      blocks.push({ type: 'text', text: content.slice(lastIndex, match.index) })
    }
    blocks.push({ type: 'code', language: match[1], code: match[2].trim() })
    lastIndex = codeBlockRegex.lastIndex
  }

  if (lastIndex < content.length) {
    blocks.push({ type: 'text', text: content.slice(lastIndex) })
  }

  return (
    <div className={cn('space-y-2 text-sm leading-relaxed text-slate-800', className)}>
      {blocks.map((block, bIdx) => {
        if (block.type === 'code') {
          return <CodeBlock key={bIdx} code={block.code} language={block.language} />
        }

        // Split text block into lines to process headers, lists, blockquotes, paragraphs
        const lines = block.text.split('\n')
        const elements = []
        let currentList = null

        lines.forEach((line, lIdx) => {
          const trimmed = line.trim()

          // Empty lines
          if (!trimmed) {
            if (currentList) {
              elements.push(currentList)
              currentList = null
            }
            return
          }

          // Headers
          if (trimmed.startsWith('### ')) {
            if (currentList) {
              elements.push(currentList)
              currentList = null
            }
            elements.push(
              <h3 key={`${bIdx}-${lIdx}`} className="mt-4 mb-1.5 text-base font-bold text-slate-900 tracking-tight">
                {formatInlineText(trimmed.slice(4))}
              </h3>
            )
            return
          }

          if (trimmed.startsWith('## ')) {
            if (currentList) {
              elements.push(currentList)
              currentList = null
            }
            elements.push(
              <h2 key={`${bIdx}-${lIdx}`} className="mt-5 mb-2 text-lg font-bold text-slate-900 border-b border-slate-200 pb-1 tracking-tight">
                {formatInlineText(trimmed.slice(3))}
              </h2>
            )
            return
          }

          if (trimmed.startsWith('# ')) {
            if (currentList) {
              elements.push(currentList)
              currentList = null
            }
            elements.push(
              <h1 key={`${bIdx}-${lIdx}`} className="mt-6 mb-2 text-xl font-black text-slate-900 tracking-tight">
                {formatInlineText(trimmed.slice(2))}
              </h1>
            )
            return
          }

          // Blockquote
          if (trimmed.startsWith('> ')) {
            if (currentList) {
              elements.push(currentList)
              currentList = null
            }
            elements.push(
              <blockquote
                key={`${bIdx}-${lIdx}`}
                className="my-2 border-l-4 border-brand-500 bg-brand-50/50 pl-3.5 py-1.5 text-slate-700 italic rounded-r-md"
              >
                {formatInlineText(trimmed.slice(2))}
              </blockquote>
            )
            return
          }

          // Bullet list items (- or *)
          const bulletMatch = trimmed.match(/^[-*]\s+(.*)/)
          if (bulletMatch) {
            if (!currentList || currentList.type !== 'ul') {
              if (currentList) elements.push(currentList)
              currentList = { type: 'ul', items: [] }
            }
            currentList.items.push(formatInlineText(bulletMatch[1]))
            return
          }

          // Numbered list items (1. 2.)
          const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/)
          if (numMatch) {
            if (!currentList || currentList.type !== 'ol') {
              if (currentList) elements.push(currentList)
              currentList = { type: 'ol', items: [] }
            }
            currentList.items.push(formatInlineText(numMatch[2]))
            return
          }

          // Regular paragraph line
          if (currentList) {
            elements.push(currentList)
            currentList = null
          }

          elements.push(
            <p key={`${bIdx}-${lIdx}`} className="my-1">
              {formatInlineText(trimmed)}
            </p>
          )
        })

        if (currentList) {
          elements.push(currentList)
        }

        return (
          <div key={bIdx} className="space-y-1">
            {elements.map((el, idx) => {
              if (el && el.type === 'ul') {
                return (
                  <ul key={idx} className="my-2 space-y-1 pl-5 list-disc marker:text-brand-500">
                    {el.items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item}</li>
                    ))}
                  </ul>
                )
              }
              if (el && el.type === 'ol') {
                return (
                  <ol key={idx} className="my-2 space-y-1 pl-5 list-decimal marker:font-bold marker:text-brand-600">
                    {el.items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item}</li>
                    ))}
                  </ol>
                )
              }
              return el
            })}
          </div>
        )
      })}
    </div>
  )
}
