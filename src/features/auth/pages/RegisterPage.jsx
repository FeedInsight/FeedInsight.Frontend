import RegisterForm from '@features/auth/components/RegisterForm.jsx'

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Create your admin account</h1>
        <p className="text-sm text-slate-500">Register your product owner account for FeedInsight.</p>
      </div>
      <RegisterForm />
    </div>
  )
}
