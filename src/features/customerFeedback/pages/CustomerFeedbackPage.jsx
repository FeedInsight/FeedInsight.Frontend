import { useNavigate } from 'react-router-dom'
import { MessageSquarePlus } from 'lucide-react'
import Button from '@shared/components/ui/Button.jsx'
import CustomerFeedbackHistory from '../components/CustomerFeedbackHistory.jsx'
import { ROUTES } from '@router/routes.js'
import PageHeader from '@shared/components/ui/PageHeader.jsx'

export default function CustomerFeedbackPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <PageHeader
        title="My Feedback Submissions"
        description="Track the status of your submitted feedback, view AI triage categorization, and review official responses from the product team."
      >
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
      </PageHeader>

      <CustomerFeedbackHistory />
    </div>
  )
}
