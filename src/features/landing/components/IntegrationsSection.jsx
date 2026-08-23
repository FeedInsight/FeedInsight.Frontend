import { ROUTES } from "@router/routes"
import { ArrowRight, ChevronRight, Plug } from "lucide-react"
import { Link } from "react-router-dom"

const BULLETS = [
  'Secure credential storage: tokens and secrets are never re-exposed in the UI',
  'Webhook-based sync keeps ticket statuses updated automatically',
  'Push individual approved stories directly to Jira as structured tickets',
]

const JiraFormMockup = () => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">

    <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white">
        <Plug size={14} strokeWidth={2} />
      </div>

      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
        Jira Integration
      </span>
    </div>

    <div className="flex flex-col gap-4 p-5">
      <div>
        <p className="mb-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          Jira base URL
        </p>

        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 dark:border-slate-700 dark:bg-slate-800">
          <span className="text-sm text-slate-400 dark:text-slate-500">
            https://[company].atlassian.net
          </span>
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          Personal Access Token
        </p>

        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 dark:border-slate-700 dark:bg-slate-800">
          <span className="text-sm tracking-widest text-slate-300 dark:text-slate-600">
            ••••••••••••••••••••••••
          </span>
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          WebHook Secret
        </p>

        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 dark:border-slate-700 dark:bg-slate-800">
          <span className="text-sm tracking-widest text-slate-300 dark:text-slate-600">
            ••••••••••••••••
          </span>
        </div>
      </div>

      <div className="mt-1 flex justify-end">
        <div className="flex h-9 w-20 items-center justify-center rounded-xl bg-brand-500 text-sm font-semibold text-white">
          Save
        </div>
      </div>
    </div>
  </div>
)

const IntegrationsSection = () => (
  <section
    id="integrations"
    className="border-t border-slate-100 bg-slate-50 py-20 dark:border-slate-800 dark:bg-slate-900">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-20">

        <div className="shrink-0 lg:w-1/2">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-500">
            Integrations
          </p>

          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 sm:text-4xl">
            Native Jira sync, no middleware
          </h2>

          <p className="mt-4 text-base leading-relaxed text-slate-500 dark:text-slate-400">
            Enter your Atlassian base URL, encode your API token once, paste your webhook
            secret, and FeedInsight handles the rest. Approved backlog items can be pushed
            to Jira as structured tickets with a single click.
          </p>

          <ul className="mt-6 flex flex-col gap-3">
            {BULLETS.map((point) => (
              <li
                key={point}
                className="flex items-start gap-2.5 text-sm text-slate-500 dark:text-slate-400">

                <ChevronRight size={14} className="mt-0.5 shrink-0 text-brand-500" strokeWidth={2.5} />
                {point}
              </li>
            ))}
          </ul>

          <Link
            to={ROUTES.register}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-600 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-2">
            Set up your workspace
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="w-full lg:w-1/2">
          <JiraFormMockup />
        </div>
      </div>
    </div>
  </section>
)

export default IntegrationsSection
