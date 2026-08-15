import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock } from 'lucide-react'
import Card from '@shared/components/ui/Card.jsx'
import Input from '@shared/components/ui/Input.jsx'
import Button from '@shared/components/ui/Button.jsx'
import { useUpdatePassword } from '../hooks/useProfile.js'

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'New password must be different from the current password',
    path: ['newPassword'],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export default function UpdatePasswordForm() {
  const { mutate: save, isPending } = useUpdatePassword()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (values) => {
    save(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
      {
        onSuccess: () => reset(),
        onError: (err) => {
          const res = err?.response?.data
          const incorrectPasswordMsg = res?.errors?.['Users.IncorrectPassword']?.[0]
          const newPasswordMsg = res?.errors?.['NewPassword']?.[0]

          if (incorrectPasswordMsg) {
            setError('currentPassword', {
              message: incorrectPasswordMsg,
            })
          }

          if (newPasswordMsg) {
            setError('newPassword', {
              message: newPasswordMsg,
            })
          }
        },
      },
    )
  }

  return (
    <Card className="flex flex-col gap-5 border border-slate-200/80 bg-white p-6 shadow-xs rounded-2xl">
      <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
          <Lock size={19} />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Change Password</h2>
          <p className="text-xs text-slate-500">Update your password to keep your account secure.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Current Password"
          type="password"
          placeholder="Enter your current password"
          error={errors.currentPassword?.message}
          disabled={isPending}
          {...register('currentPassword')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="New Password"
            type="password"
            placeholder="Minimum 8 characters"
            error={errors.newPassword?.message}
            disabled={isPending}
            {...register('newPassword')}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Re-enter new password"
            error={errors.confirmPassword?.message}
            disabled={isPending}
            {...register('confirmPassword')}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="md" isLoading={isPending} disabled={isPending} className="shadow-sm">
            Update Password
          </Button>
        </div>
      </form>
    </Card>
  )
}
