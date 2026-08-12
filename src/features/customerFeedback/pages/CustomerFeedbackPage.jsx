import CustomerFeedbackForm from '@features/customerFeedback/components/CustomerFeedbackForm.jsx'
import CustomerFeedbackHistory from '@features/customerFeedback/components/CustomerFeedbackHistory.jsx'

export default function CustomerFeedbackPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <CustomerFeedbackForm />
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">My Feedback</h1>
            <p className="mt-2 text-sm text-slate-500">
              View your submitted feedback and any comments from the product team.
            </p>
          </div>
          <CustomerFeedbackHistory />
        </div>
      </div>
    </div>
  )
}
