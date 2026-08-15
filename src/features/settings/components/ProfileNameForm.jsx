import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User } from 'lucide-react'
import Card from '@shared/components/ui/Card.jsx'
import Input from '@shared/components/ui/Input.jsx'
import Button from '@shared/components/ui/Button.jsx'
import { useAuth } from '@shared/hooks/useAuth.js'
import { useUpdateProfile } from '../hooks/useProfile.js'

const schema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
})

export default function ProfileNameForm() {
  const { user } = useAuth()
  const { mutate: save, isPending } = useUpdateProfile()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
    },
  })

  useEffect(() => {
    reset({
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
    })
  }, [user?.firstName, user?.lastName, reset])

  const onSubmit = (values) => {
    save({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
    })
  }

  return (
    <Card className="flex flex-col gap-5 border border-slate-200/80 bg-white p-6 shadow-xs rounded-2xl">
      <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
          <User size={19} />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
          <p className="text-xs text-slate-500">Update your first and last name.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="First Name"
            placeholder="e.g. Alex"
            error={errors.firstName?.message}
            disabled={isPending}
            {...register('firstName')}
          />

          <Input
            label="Last Name"
            placeholder="e.g. Johnson"
            error={errors.lastName?.message}
            disabled={isPending}
            {...register('lastName')}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="md" isLoading={isPending} disabled={isPending} className="shadow-sm">
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  )
}