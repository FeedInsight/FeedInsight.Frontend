import { ROUTES } from "@router/routes"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const HeroSection = () => (
  <section className="relative overflow-hidden bg-white dark:bg-slate-950">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          'radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)',
        backgroundSize: '28px 28px',
      }}
    />

    <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-brand-500/5" />

    <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
      <h1 className="max-w-3xl text-4xl font-bold text-slate-900 sm:text-5xl lg:text-6xl dark:text-slate-50">
        Turn customer feedback into
        <span className="text-brand-500"> actionable backlogs</span>
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
        FeedInsight connects your customer voice directly to your development workflow. Collect,
        triage, and prioritize feedback, then push structured tickets to Jira without leaving the
        platform.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Link
          to={ROUTES.register}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-600 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-2"
        >
          Get started
          <ArrowRight size={15} />
        </Link>

        <a
          href="#features"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          See features
        </a>
      </div>
    </div>
  </section>
)

export default HeroSection
