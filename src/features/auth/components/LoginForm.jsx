import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@shared/components/ui/Button.jsx'
import { useLogin } from '@features/auth/hooks/useLogin.js'
import Input from '@shared/components/ui/Input'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export default function LoginForm() {
  const { mutate, isPending } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  return (
    <form
      onSubmit={handleSubmit((values) => mutate(values))}
      className="w-full flex flex-col gap-4"
      noValidate
    >
      <Input
        label="Email"
        type="email"
        placeholder="example@company.com"
        autoComplete="email"
        error={errors.email?.message}
        disabled={isPending}
        required
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        error={errors.password?.message}
        disabled={isPending}
        required
        {...register('password')}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isPending}
        disabled={isPending}
        className="w-full mt-2"
      >
        {isPending ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  )
}
