import { ROUTES } from "@router/routes"
import FeedInsightLogoText from "@shared/components/ui/FeedInsightLogoText"
import { Link } from "react-router-dom"

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-100 bg-slate-50 py-8 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <Link to={ROUTES.landing}>
          <FeedInsightLogoText />
        </Link>

        <p className="text-xs text-slate-400 dark:text-slate-500">
          &copy; {year} FeedInsight. All rights reserved.
        </p>

        <nav className="flex items-center gap-5" aria-label="Footer navigation">
          <Link
            to={ROUTES.login}
            className="text-xs text-slate-400 transition-colors hover:text-slate-700 dark:hover:text-slate-300"
          >
            Log in
          </Link>

          <Link
            to={ROUTES.register}
            className="text-xs text-slate-400 transition-colors hover:text-slate-700 dark:hover:text-slate-300"
          >
            Sign up
          </Link>
        </nav>
      </div>
    </footer>
  )
}

export default Footer
