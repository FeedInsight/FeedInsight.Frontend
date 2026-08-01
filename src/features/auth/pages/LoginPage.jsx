import LoginForm from '@features/auth/components/LoginForm.jsx'
import FeedInsightLogoText from '@shared/components/ui/FeedInsightLogoText'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col gap-3">
      <div>
        <div className="flex flex-col items-center mb-3">
          <FeedInsightLogoText className="h-12" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Welcome back!</h1>
          <p className="text-sm text-slate-500">Sign in to your product intelligence workspace.</p>
        </div>
      </div>
      <LoginForm />
      <div className="text-center text-sm text-[#6B7280]">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          Register now!
        </button>
      </div>
    </div>
  )
}
