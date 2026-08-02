import { useState } from 'react'
import Button from '@shared/components/ui/Button.jsx'
import { useRegister } from '../hooks/useRegister.js'
import Input from '@shared/components/ui/Input.jsx'

const initialFormData = {
  companyName: '',
  firstName: '',
  lastName: '',
  workEmail: '',
  password: '',
}

export default function RegisterForm() {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const { mutate, isPending } = useRegister()

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((currentData) => ({ ...currentData, [name]: value }))

    if (errors[name]) {
      setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required'
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.workEmail.trim()) {
      newErrors.workEmail = 'Work email is required'
    } else if (!emailPattern.test(formData.workEmail.trim())) {
      newErrors.workEmail = 'Enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
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
      companyName: formData.companyName.trim(),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.workEmail.trim().toLowerCase(),
      password: formData.password,
    }

    mutate(payload)
  }

  return (
    <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      <Input
        label="Company Name"
        type="text"
        name="companyName"
        placeholder="Enter Company Name"
        value={formData.companyName}
        onChange={handleChange}
        disabled={isPending}
        error={errors.companyName}
        required
      />

      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <div className="min-w-0 flex-1">
          <Input
            label="First Name"
            type="text"
            name="firstName"
            placeholder="Admin First Name"
            value={formData.firstName}
            onChange={handleChange}
            disabled={isPending}
            error={errors.firstName}
            required
          />
        </div>
        <div className="min-w-0 flex-1">
          <Input
            label="Last Name"
            type="text"
            name="lastName"
            placeholder="Admin Last Name"
            value={formData.lastName}
            onChange={handleChange}
            disabled={isPending}
            error={errors.lastName}
            required
          />
        </div>
      </div>

      <Input
        label="Work Email"
        type="email"
        name="workEmail"
        placeholder="example@company.com"
        value={formData.workEmail}
        onChange={handleChange}
        disabled={isPending}
        error={errors.workEmail}
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

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isPending}
        disabled={isPending}
        className="w-full mt-2"
      >
        {isPending ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  )
}
