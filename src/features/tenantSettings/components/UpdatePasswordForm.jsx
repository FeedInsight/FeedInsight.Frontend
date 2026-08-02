import z from "zod"
import { useUpdatePassword } from "../hooks/useProfile"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Card from "@shared/components/ui/Card"
import { Lock } from "lucide-react"
import Input from "@shared/components/ui/Input"
import Button from "@shared/components/ui/Button"

const schema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

const UpdatePasswordForm = () => {
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
          const msg =
            err?.response?.data?.errors?.['Users.IncorrectPassword']?.[0]

          if (msg) {
            setError('currentPassword', {
              message: msg,
            })
          }
        },
      },
    )
  }

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50">
          <Lock size={18} className="text-brand-600" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900">Change Password</h2>
          <p className="text-sm text-slate-500">
            Update your password to keep your account secure
          </p>
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

        <Input
          label="New Password"
          type="password"
          placeholder="Enter your new password"
          error={errors.newPassword?.message}
          disabled={isPending}
          {...register('newPassword')}
        />

        <Input
          label="Confirm New Password"
          type="password"
          placeholder="Re-enter your new password"
          error={errors.confirmPassword?.message}
          disabled={isPending}
          {...register('confirmPassword')}
        />

        <div className="flex justify-end">
          <Button type="submit" isLoading={isPending}>
            Update password
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default UpdatePasswordForm
