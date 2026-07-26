import { useRef, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'

/**
 * Optional screenshot attachment for FeedbackForm, per README:
 * "Packages unstructured text payloads alongside optional screenshots
 * securely via multipart/form-data."
 *
 * Props: value (File|null), onChange (file: File|null) => void
 * Keep validation (file type/size limits) here so FeedbackForm's schema
 * only has to check "is this a File instance", not re-implement rules.
 */
const MAX_SIZE_MB = 5

export default function ScreenshotUploader({ value, onChange }) {
  const inputRef = useRef(null)
  const [error, setError] = useState('')

  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please attach an image file.')
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_SIZE_MB}MB.`)
      return
    }
    setError('')
    onChange(file)
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {!value ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-500 hover:border-brand-400"
        >
          <ImagePlus size={16} /> Attach a screenshot (optional)
        </button>
      ) : (
        <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <span className="truncate">{value.name}</span>
          <button type="button" onClick={() => onChange(null)} aria-label="Remove attachment">
            <X size={16} className="text-slate-400 hover:text-red-500" />
          </button>
        </div>
      )}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </div>
  )
}
