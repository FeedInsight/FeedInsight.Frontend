import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import Input from '@shared/components/ui/Input.jsx'
import Button from '@shared/components/ui/Button.jsx'
import { useLogin } from '@features/auth/hooks/useLogin.js'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

/** Admin Portal login form -- JWT auth per README §Admin Portal. */
export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
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
    <form onSubmit={handleSubmit((values) => mutate(values))} className="flex flex-col gap-4" noValidate>
      <Input
        id="login-email"
        label="Email"
        type="email"
        placeholder="admin@company.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        id="login-password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        autoComplete="current-password"
        error={errors.password?.message}
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="p-1 focus:outline-none focus:ring-1 focus:ring-brand-500 rounded"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
        {...register('password')}
      />

      <Button type="submit" isLoading={isPending} className="mt-2 w-full">
        Sign in
      </Button>

      <div className="text-center">
        <a href="/register" className="text-sm font-medium text-brand-600 hover:text-brand-700">
          Don&apos;t have an account? Register
        </a>
      </div>
    </form>
  )
}
