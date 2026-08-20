import { MessageSquarePlus, Sparkles, CheckCircle2 } from 'lucide-react'
import CustomerFeedbackForm from '../components/CustomerFeedbackForm.jsx'

export default function SubmitCustomerFeedbackPage() {
  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Page Heading */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5 dark:text-slate-100">
          <MessageSquarePlus className="w-7 h-7 text-brand-600" />
          <span>Submit Customer Feedback</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Share your ideas, requests, or report issues directly to our product engineering team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Form Container (Takes 2 Columns on large screens) */}
        <div className="lg:col-span-2">
          <CustomerFeedbackForm showBackLink={true} />
        </div>

        {/* Tips & How It Works Sidebar (1 Column) */}
        <div className="flex flex-col gap-5">
          {/* How It Works Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col gap-4 dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 dark:text-slate-100">
              <Sparkles size={16} className="text-indigo-600" />
              <span>How your feedback is handled</span>
            </h3>

            <div className="flex flex-col gap-3.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 border border-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800">
                  1
                </div>
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    Triage & Analysis:
                  </span>{' '}
                  Your feedback is automatically processed by our intelligence engine to understand
                  sentiment and routing.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 border border-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800">
                  2
                </div>
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    Product Owner Review:
                  </span>{' '}
                  The product owner reviews your feedback directly in their management dashboard.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 border border-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800">
                  3
                </div>
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    Direct Responses:
                  </span>{' '}
                  You can track the feedback thread and read official responses posted by the
                  product team.
                </div>
              </div>
            </div>
          </div>

          {/* Best Practices Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-5 shadow-xs flex flex-col gap-3 dark:border-slate-700 dark:from-slate-900 dark:to-slate-800">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 dark:text-slate-100">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Tips for actionable feedback</span>
            </h3>

            <ul className="flex flex-col gap-2 text-xs text-slate-600 list-disc list-inside dark:text-slate-300">
              <li>
                <span className="font-medium text-slate-800 dark:text-slate-100">
                  Be clear & specific:
                </span>{' '}
                Describe what you observed or what enhancement you would like to see.
              </li>
              <li>
                <span className="font-medium text-slate-800 dark:text-slate-100">Context:</span>{' '}
                Provide any relevant details that help us understand the problem or request.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
