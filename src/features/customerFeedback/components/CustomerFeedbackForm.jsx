import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@shared/components/ui/Input.jsx'
import Textarea from '@shared/components/ui/Textarea.jsx'
import Button from '@shared/components/ui/Button.jsx'
import Card from '@shared/components/ui/Card.jsx'
import { useSubmitCustomerFeedback } from '@features/customerFeedback/hooks/useCustomerFeedback.js'

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(120),
  description: z.string().min(1, 'Description is required').max(2000),
  category: z.string().min(1, 'Category is required').max(100),
})

export default function CustomerFeedbackForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })
  const submitFeedback = useSubmitCustomerFeedback()

  useEffect(() => {
    if (submitFeedback.isSuccess) {
      reset()
    }
  }, [submitFeedback.isSuccess, reset])

  const onSubmit = async (values) => {
    await submitFeedback.mutateAsync(values)
  }

  return (
    <Card className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Submit new feedback</h2>
        <p className="text-sm text-slate-500">
          Share your idea, issue, or request with the product team.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <Input label="Title" error={errors.title?.message} {...register('title')} />
        <Input label="Category" error={errors.category?.message} {...register('category')} />
        <Textarea
          label="Description"
          rows={5}
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="flex justify-end">
          <Button type="submit" isLoading={submitFeedback.isPending}>
            Submit Feedback
          </Button>
        </div>
      </form>
    </Card>
  )
}
