import { useState } from 'react'
import InputField from '../components/InputField'
import Button from '@shared/components/ui/Button.jsx'
import { useRegister } from '../hooks/useRegister.js'
import { useNavigate } from 'react-router-dom'

const initialFormData = {
  companyName: '',
  firstName: '',
  lastName: '',
  workEmail: '',
  password: '',
}

export default function RegisterPage() {
  const navigate = useNavigate()
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
    <>
      <div className="flex flex-col gap-3">
        <div>
          <div className="text-3xl font-bold mb-1 text-[#111827]">Create your account</div>
          <div className="text-lg mb-5 text-[#6B7280]">
            Join thousands of enterprises optimizing their feedback loops
          </div>
        </div>

        <form className="w-full" onSubmit={handleSubmit} noValidate>
          <InputField
            label="Company Name"
            type="text"
            name="companyName"
            placeholder="Enter Company Name"
            value={formData.companyName}
            onChange={handleChange}
            error={errors.companyName}
            required
          />
          <div className="flex w-full flex-col gap-2 sm:flex-row">
            <div className="min-w-0 flex-1">
              <InputField
                label="First Name"
                type="text"
                name="firstName"
                placeholder="Admin First Name"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                required
              />
            </div>
            <div className="min-w-0 flex-1">
              <InputField
                label="Last Name"
                type="text"
                name="lastName"
                placeholder="Admin Last Name"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required
              />
            </div>
          </div>
          <InputField
            label="Work Email"
            type="email"
            name="workEmail"
            placeholder="example@company.com"
            value={formData.workEmail}
            onChange={handleChange}
            error={errors.workEmail}
            required
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isPending}
            className="w-full mt-2"
          >
            {isPending ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <div className="text-sm flex justify-center text-[#6B7280]">
          By signing up, you agree to our Terms and Privacy Policy.
        </div>
        <div className="text-center text-sm text-[#6B7280]">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>
    </>
  )
}