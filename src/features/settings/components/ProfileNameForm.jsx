import { useAuth } from "@shared/hooks/useAuth"
import z from "zod"
import { useUpdateProfile } from "../hooks/useProfile"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import Card from "@shared/components/ui/Card"
import { User } from "lucide-react"
import Input from "@shared/components/ui/Input"
import Button from "@shared/components/ui/Button"

const schema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
})

const ProfileNameForm = () => {
  const { user } = useAuth()
  const { mutate: save, isPending } = useUpdateProfile()

  const oldFirstName = user?.firstName ?? ''
  const oldLastName = user?.lastName ?? ''

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: oldFirstName,
      lastName: oldLastName,
    },
  })

  useEffect(() => {
    reset({
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
    })
  }, [user?.firstName, user?.lastName, reset])

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50">
          <User size={18} className="text-brand-600" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900">Personal Information</h2>
          <p className="text-sm text-slate-500">Update the first and last name </p>
        </div>
      </div>

      <form onSubmit={handleSubmit((values) => save(values))} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="First Name"
            placeholder="e.g. Will"
            error={errors.firstName?.message}
            disabled={isPending}
            {...register('firstName')}
          />

          <Input
            label="Last Name"
            placeholder="e.g. Smith"
            error={errors.lastName?.message}
            disabled={isPending}
            {...register('lastName')}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" isLoading={isPending}>
            Save changes
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default ProfileNameForm;