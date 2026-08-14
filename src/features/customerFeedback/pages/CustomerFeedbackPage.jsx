import { useNavigate } from 'react-router-dom'
import { MessagesSquare, Plus, MessageSquarePlus } from 'lucide-react'
import Button from '@shared/components/ui/Button.jsx'
import CustomerFeedbackHistory from '../components/CustomerFeedbackHistory.jsx'
import { ROUTES } from '@router/routes.js'

export default function CustomerFeedbackPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <MessagesSquare className="w-7 h-7 text-brand-600" />
            <span>My Feedback Submissions</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track the status of your submitted feedback, view AI triage categorization, and review official responses from the product team.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={() => navigate(ROUTES.customerSubmitFeedback)}
          className="shadow-md shadow-brand-500/20 px-5 shrink-0"
        >
          <MessageSquarePlus size={16} />
          <span>Submit New Feedback</span>
        </Button>
      </div>

      {/* Main Feedback List */}
      <CustomerFeedbackHistory />
    </div>
  )
}
