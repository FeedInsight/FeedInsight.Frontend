import { ROUTES } from "@router/routes"
import FeedInsightLogoText from "@shared/components/ui/FeedInsightLogoText"
import { Link } from "react-router-dom"

const NAVLINKS = [
  { label: 'Features', href: '#features' }
]

const LandingTopbar = () => (
  <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/90">
    <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
      <Link to={ROUTES.landing} className="flex items-center gap-2 shrink-0">
        <FeedInsightLogoText />
      </Link>

      <nav className="hidden md:flex items-center gap-6">
        {NAVLINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            {label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <Link
          to={ROUTES.login}
          className="rounded-xl px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          Log in
        </Link>

        <Link
          to={ROUTES.register}
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-3.5 py-1.5 text-sm font-semibold text-white transition-all hover:bg-brand-600 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-2"
        >
          Sign up
        </Link>
      </div>
    </div>
  </header>
)

export default LandingTopbar
