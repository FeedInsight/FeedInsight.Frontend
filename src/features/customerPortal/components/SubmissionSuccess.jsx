import { CheckCircle2 } from 'lucide-react'

/** Shown after a successful FeedbackForm submit. Stateless confirmation --
 * the Customer Portal never shows the user how their feedback was
 * classified (that's Admin Portal territory). */
export default function SubmissionSuccess({ onSubmitAnother }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <CheckCircle2 className="text-emerald-500" size={40} />
      <h2 className="text-lg font-semibold text-slate-800">Thanks for your feedback!</h2>
      <p className="max-w-xs text-sm text-slate-500">
        Our team has received it and will review it shortly.
      </p>
      <button onClick={onSubmitAnother} className="text-sm font-medium text-brand-600 hover:underline">
        Submit another response
      </button>
    </div>
  )
}
