import { ROUTES } from "@router/routes"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const CtaBanner = () => (
  <section className="border-t border-slate-100 bg-white py-20 dark:border-slate-800 dark:bg-slate-950">
    <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 sm:text-4xl">
        Ready to close the loop on feedback?
      </h2>

      <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-500 dark:text-slate-400">
        Create your workspace and connect your first feedback source in minutes.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          to={ROUTES.register}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-600 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-2">
          Create an account
          <ArrowRight size={15} />
        </Link>

        <Link
          to={ROUTES.login}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
          Log in
        </Link>
      </div>
    </div>
  </section>
)

export default CtaBanner
