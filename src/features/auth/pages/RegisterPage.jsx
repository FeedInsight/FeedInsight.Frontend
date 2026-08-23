import { ROUTES } from '@router/routes'
import RegisterForm from '../components/RegisterForm'
import FeedInsightLogoText from '@shared/components/ui/FeedInsightLogoText'
import { Link, useNavigate } from 'react-router-dom'

export default function RegisterPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-3">
      <div>
        <div className="flex flex-col items-center mb-3">
          <Link to={ROUTES.landing}>
            <FeedInsightLogoText className="h-12" />
          </Link>
        </div>

        <div className="flex flex-col items-center gap-1">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Create your account</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
            Join thousands of enterprises optimizing their feedback loops
          </p>
        </div>
      </div>

      <RegisterForm />

      <div className="text-xs text-center text-[#6B7280]">
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
  )
}
