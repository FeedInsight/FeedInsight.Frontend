import { useState } from 'react'
import TenantResolver from '@features/customerPortal/components/TenantResolver.jsx'
import FeedbackForm from '@features/customerPortal/components/FeedbackForm.jsx'
import SubmissionSuccess from '@features/customerPortal/components/SubmissionSuccess.jsx'
import Card from '@shared/components/ui/Card.jsx'

/**
 * Top-level page for the public Customer Portal route(s) in router/routes.js
 * (customerFeedback / customerFeedbackDefault). Composition only: resolve
 * tenant, then toggle between the form and its success state. Do not add
 * data-fetching directly in this file -- it belongs in the feature's
 * hooks/api files.
 */
export default function CustomerFeedbackPage() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <TenantResolver>
      <Card>
        {submitted ? (
          <SubmissionSuccess onSubmitAnother={() => setSubmitted(false)} />
        ) : (
          <FeedbackForm onSubmitted={() => setSubmitted(true)} />
        )}
      </Card>
    </TenantResolver>
  )
}
