import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@shared/components/ui/Input.jsx'
import Button from '@shared/components/ui/Button.jsx'
import { useLogin } from '@features/auth/hooks/useLogin.js'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

/** Admin Portal login form -- JWT auth per README §Admin Portal. */
export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })
  const { mutate, isPending } = useLogin()

  return (
    <form onSubmit={handleSubmit((values) => mutate(values))} className="flex flex-col gap-4">
      <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
      <Input label="Password" type="password" error={errors.password?.message} {...register('password')} />
      <Button type="submit" isLoading={isPending} className="mt-2">
        Sign in
      </Button>
      <a href="/register" className="text-sm text-brand-600 hover:text-brand-700">
        Don&apos;t have an account? Register
      </a>
    </form>
  )
}
