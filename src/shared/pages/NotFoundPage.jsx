import { useNavigate } from 'react-router-dom'
import { FileQuestion, Home, ArrowLeft } from 'lucide-react'
import Button from '@shared/components/ui/Button.jsx'
import { useAuth } from '@shared/hooks/useAuth.js'
import { getDashboardRouteForRole } from '@shared/utils/roleUtils.js'

export default function NotFoundPage() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()

  const handleHomeClick = () => {
    if (isAuthenticated && user?.role) {
      navigate(getDashboardRouteForRole(user.role))
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full text-center flex flex-col items-center">
        <div className="w-20 h-20 rounded-3xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shadow-sm mb-6 animate-bounce">
          <FileQuestion size={40} />
        </div>

        <span className="text-sm font-semibold text-brand-600 tracking-wider uppercase mb-1">
          404 Error
        </span>

        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Page not found
        </h1>

        <p className="text-base text-slate-600 mb-8 max-w-sm">
          Sorry, we couldn’t find the page you’re looking for. It might have been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto"
          >
            <ArrowLeft size={16} />
            Go Back
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleHomeClick}
            className="w-full sm:w-auto"
          >
            <Home size={16} />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
