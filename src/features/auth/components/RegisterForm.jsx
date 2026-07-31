import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@shared/components/ui/Input.jsx'
import Button from '@shared/components/ui/Button.jsx'
import { useRegister } from '@features/auth/hooks/useRegister.js'

const schema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export default function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })
  const { mutate, isPending } = useRegister()

  return (
    <form onSubmit={handleSubmit((values) => mutate(values))} className="flex flex-col gap-4">
      <Input label="Company name" error={errors.companyName?.message} {...register('companyName')} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="First name" error={errors.firstName?.message} {...register('firstName')} />
        <Input label="Last name" error={errors.lastName?.message} {...register('lastName')} />
      </div>
      <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
      <Input label="Password" type="password" error={errors.password?.message} {...register('password')} />
      <Button type="submit" isLoading={isPending} className="mt-2">
        Create account
      </Button>
      <a href="/login" className="text-sm text-brand-600 hover:text-brand-700">
        Already have an account? Log in
      </a>
    </form>
  )
}
