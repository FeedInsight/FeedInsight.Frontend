import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { MessageSquarePlus, Send, ArrowLeft, Info } from 'lucide-react'
import Textarea from '@shared/components/ui/Textarea.jsx'
import Button from '@shared/components/ui/Button.jsx'
import Card from '@shared/components/ui/Card.jsx'
import { useSubmitDevelopmentCustomerFeedback } from '../hooks/useCustomerFeedback.js'
import { ROUTES } from '@router/routes.js'

const schema = z.object({
  rawContent: z
    .string()
    .trim()
    .min(5, 'Feedback content must be at least 5 characters')
    .max(4000, 'Feedback content cannot exceed 4000 characters'),
})

export default function CustomerFeedbackForm({ onSuccessCallback, showBackLink = true }) {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      rawContent: '',
    },
  })

  const contentValue = watch('rawContent') || ''

  const { mutate: submitFeedback, isPending, isSuccess } = useSubmitDevelopmentCustomerFeedback()

  useEffect(() => {
    if (isSuccess) {
      reset({
        rawContent: '',
      })
      if (onSuccessCallback) {
        onSuccessCallback()
      } else {
        navigate(ROUTES.customerFeedback)
      }
    }
  }, [isSuccess, reset, navigate, onSuccessCallback])

  const onSubmit = (values) => {
    // Send only rawContent without metadataJson
    const payload = {
      rawContent: values.rawContent.trim(),
    }

    submitFeedback(payload)
  }

  return (
    <Card className="flex flex-col gap-6 border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs rounded-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 border border-brand-100/80 shadow-2xs">
            <MessageSquarePlus size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Submit Customer Feedback</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Share your suggestions, requests, or report issues directly to the product engineering team.
            </p>
          </div>
        </div>

        {showBackLink && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.customerFeedback)}
            className="self-start sm:self-auto text-xs"
          >
            <ArrowLeft size={14} />
            <span>View My Submissions</span>
          </Button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Textarea
            label="Feedback Details & Description"
            placeholder="Describe your suggestion, request, or issue in detail..."
            rows={8}
            error={errors.rawContent?.message}
            disabled={isPending}
            required
            {...register('rawContent')}
          />
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Minimum 5 characters required</span>
            <span className={contentValue.length > 3800 ? 'text-amber-600 font-semibold' : ''}>
              {contentValue.length} / 4000 characters
            </span>
          </div>
        </div>

        {/* Informative Note */}
        <div className="flex items-start gap-2.5 rounded-xl bg-blue-50/70 border border-blue-100 p-3.5 text-xs text-blue-900">
          <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold">Direct Product Team Channel:</span> Your feedback will be reviewed by the product owner, and any official responses or updates will appear directly on your feedback thread.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-100">
          {showBackLink && (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => navigate(ROUTES.customerFeedback)}
              disabled={isPending}
            >
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isPending}
            disabled={isPending}
            className="w-full sm:w-auto shadow-md shadow-brand-500/20 px-8"
          >
            <Send size={15} />
            <span>{isPending ? 'Submitting Feedback...' : 'Submit Feedback'}</span>
          </Button>
        </div>
      </form>
    </Card>
  )
}
