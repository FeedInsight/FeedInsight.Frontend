import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Textarea from '@shared/components/ui/Textarea.jsx'
import Input from '@shared/components/ui/Input.jsx'
import Button from '@shared/components/ui/Button.jsx'
import ScreenshotUploader from './ScreenshotUploader.jsx'
import { useSubmitFeedback } from '@features/customerPortal/hooks/useSubmitFeedback.js'

/**
 * The core Customer Portal form. Deliberately a SINGLE free-text field --
 * per the README's value proposition, splitting compound feedback into
 * distinct bugs/features is the Router Agent's job server-side (Flow 2),
 * not something the UI should pre-structure or constrain.
 *
 * On success, calling code (CustomerFeedbackPage) should swap this form out
 * for SubmissionSuccess.jsx rather than resetting it in place.
 */
const schema = z.object({
  rawContent: z.string().min(10, 'Please describe your feedback in a bit more detail.'),
  submitterEmail: z.string().email('Enter a valid email').optional().or(z.literal('')),
})

export default function FeedbackForm({ onSubmitted }) {
  const [screenshot, setScreenshot] = useState(null)
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })
  const { mutateAsync, isPending } = useSubmitFeedback()

  const onSubmit = async (values) => {
    await mutateAsync({ ...values, screenshot })
    onSubmitted?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Textarea
        label="Tell us what's on your mind"
        placeholder="Describe a bug you ran into, or a feature you'd like to see…"
        error={errors.rawContent?.message}
        {...register('rawContent')}
      />
      <Input
        label="Email (optional, so we can follow up)"
        type="email"
        placeholder="you@example.com"
        error={errors.submitterEmail?.message}
        {...register('submitterEmail')}
      />
      <ScreenshotUploader value={screenshot} onChange={setScreenshot} />
      <Button type="submit" isLoading={isPending}>
        Submit feedback
      </Button>
    </form>
  )
}
