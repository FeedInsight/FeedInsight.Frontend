import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserPlus, ArrowLeft } from 'lucide-react'
import Button from '@shared/components/ui/Button.jsx'
import Input from '@shared/components/ui/Input.jsx'
import Card from '@shared/components/ui/Card.jsx'
import { useCreateCompanyCustomer } from '../hooks/useCustomers.js'
import { ROUTES } from '@router/routes.js'
import PageHeader from '@shared/components/ui/PageHeader.jsx'

const initialFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
}

export default function AddCustomerPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const { mutate: createCustomer, isPending } = useCreateCompanyCustomer()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
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

  const handleSubmit = (e) => {
    e.preventDefault()
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

    createCustomer(payload, {
      onSuccess: () => {
        navigate(ROUTES.workspaceCustomers)
      },
    })
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(ROUTES.workspaceCustomers)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-slate-700 border border-slate-200 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={14} className="text-slate-500" />
          <span>Back to Customers</span>
        </button>
      </div>

      <PageHeader
        title="Add New Customer"
        description="Create a new company customer account for your tenant organization."
      />

      <Card className="p-6 border border-slate-200/80 bg-white shadow-xs rounded-2xl">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              type="text"
              name="firstName"
              placeholder="e.g. Alex"
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
              placeholder="e.g. Johnson"
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
            placeholder="e.g. alex.johnson@clientcompany.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isPending}
            error={errors.email}
            required
          />

          <Input
            label="Initial Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            disabled={isPending}
            error={errors.password}
            required
          />

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => navigate(ROUTES.workspaceCustomers)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isPending}
              disabled={isPending}
              className="shadow-md shadow-brand-500/20 px-6"
            >
              <UserPlus size={16} />
              <span>{isPending ? 'Creating Customer...' : 'Create Customer'}</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
