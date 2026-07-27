import { useState } from 'react'
import InputField from '../components/InputField'
import toast from './../../node_modules/react-hot-toast/src/index'

const initialFormData = {
  companyName: '',
  adminName: '',
  workEmail: '',
  password: '',
}

export default function RegisterPage() {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})

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

    if (!formData.adminName.trim()) {
      newErrors.adminName = 'Full name is required'
    } else if (formData.adminName.trim().length < 3) {
      newErrors.adminName = 'Full name must be at least 3 characters'
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
    toast.success('Account Created Successfully!')
    //// ROUTING
    //  navigate("/login or dashboard");
    console.log(formData)
  }

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-[#fbfcff]">
        <div className="flex w-[45%] flex-col justify-center rounded-xl bg-white px-12 py-8 shadow-lg shadow-slate-200/60">
          <div className="text-3xl font-bold mb-1 text-[#111827]">Create your account</div>
          <div className="text-l mb-5 text-[#6B7280]">
            Join thousands of enterprises optimizing their feedback loops
          </div>
          <form className="mb-4 w-full" onSubmit={handleSubmit} noValidate>
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
                  label="Admin Full Name"
                  type="text"
                  name="adminName"
                  placeholder="Example Name"
                  value={formData.adminName}
                  onChange={handleChange}
                  error={errors.adminName}
                  required
                />
              </div>
              <div className="min-w-0 flex-1">
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
              </div>
            </div>
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
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              Create account
            </button>
          </form>
          <div className="text-sm flex justify-center text-[#6B7280]">
            By signing up, you agree to our Terms and Privacy Policy.
          </div>
        </div>
      </div>
    </>
  )
}
