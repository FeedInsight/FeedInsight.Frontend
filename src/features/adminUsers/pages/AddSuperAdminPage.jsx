import { useState } from 'react'
import { ShieldCheck, UserPlus, CheckCircle2 } from 'lucide-react'
import Button from '@shared/components/ui/Button.jsx'
import Input from '@shared/components/ui/Input.jsx'
import { useRegisterAdmin } from '../hooks/useRegisterAdmin.js'

const initialFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
}

export default function AddSuperAdminPage() {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const { mutate, isPending } = useRegisterAdmin()

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (successMessage) {
      setSuccessMessage('')
    }
  }

  const validate = () => {
    const newErrors = {}
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!emailPattern.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    return newErrors
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const validationErrors = validate()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})

    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password,
    }

    mutate(payload, {
      onSuccess: () => {
        setFormData(initialFormData)
        setSuccessMessage(`Super Admin account registered successfully for ${payload.email}!`)
      },
    })
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex flex-col gap-1 border-b border-slate-200/80 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-brand-600" />
          Add Super Admin
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Create a new platform Super Admin user with complete platform administration privileges.
        </p>
      </div>

      {successMessage && (
        <div className="flex items-start gap-3 rounded-xl bg-emerald-50 p-4 text-emerald-800 border border-emerald-200 shadow-2xs">
          <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Success</span>
            <span className="text-xs text-emerald-700">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Registration Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              type="text"
              name="firstName"
              placeholder="e.g. John"
              value={formData.firstName}
              onChange={handleChange}
              disabled={isPending}
              error={errors.firstName}
              required
            />

            <Input
              label="Last Name"
              type="text"
              name="lastName"
              placeholder="e.g. Doe"
              value={formData.lastName}
              onChange={handleChange}
              disabled={isPending}
              error={errors.lastName}
              required
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="e.g. admin@company.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isPending}
            error={errors.email}
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            disabled={isPending}
            error={errors.password}
            required
          />

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isPending}
              disabled={isPending}
              className="shadow-md shadow-brand-500/20 px-6"
            >
              <UserPlus size={16} />
              <span>{isPending ? 'Registering Super Admin...' : 'Add Super Admin'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
