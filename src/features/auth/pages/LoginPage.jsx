import LoginForm from '@features/auth/components/LoginForm.jsx'

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">FeedInsight Admin</h1>
        <p className="text-sm text-slate-500">Sign in to your product intelligence workspace.</p>
      </div>
      <LoginForm />
    </div>
  )
}
