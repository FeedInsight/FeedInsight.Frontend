import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, ShieldCheck } from 'lucide-react'
import Card from '@shared/components/ui/Card.jsx'
import Input from '@shared/components/ui/Input.jsx'
import Button from '@shared/components/ui/Button.jsx'
import { useAuth } from '@shared/hooks/useAuth.js'
import { useUpdateProfile } from '../hooks/useProfile.js'

const schema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
})

export default function CustomerProfileForm() {
  const { user } = useAuth()
  const { mutate: updateProfileInfo, isPending } = useUpdateProfile()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    },
  })

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      })
    }
  }, [user, reset])

  const onSubmit = (values) => {
    updateProfileInfo(values)
  }

  return (
    <Card className="flex flex-col gap-5 border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <User size={20} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Customer Profile</h2>
            <p className="text-xs text-slate-500">Update your personal account information and email.</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100">
          <ShieldCheck size={13} />
          <span>Company Customer</span>
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

        <Input
          label="Email Address"
          type="email"
          placeholder="customer@example.com"
          error={errors.email?.message}
          disabled={isPending}
          {...register('email')}
        />

        <div className="flex justify-end pt-2">
          <Button type="submit" isLoading={isPending} disabled={isPending}>
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  )
}
