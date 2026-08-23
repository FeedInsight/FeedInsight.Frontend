import { Inbox, KeyRound, LayoutDashboard, MessageSquare, Plug, TrendingUp } from "lucide-react"

const FEATURES = [
  {
    icon: TrendingUp,
    title: 'Dashboard Analytics',
    description:
      'Real-time KPI cards tracking feedback volume alongside positive, neutral, and negative sentiment trends, all in a single view.',
  },
  {
    icon: Inbox,
    title: 'Feedback Hub & Triage',
    description:
      'A unified inbox to collect, categorize, and directly respond to customer feedback. Keep every conversation in one place.',
  },
  {
    icon: MessageSquare,
    title: 'AI Assistant & Backlog Review',
    description:
      'Automatically extract actionable tasks and generate draft user stories from raw feedback.',
  },
  {
    icon: Plug,
    title: 'Jira Integration',
    description:
      'Jira configuration to sync webhooks and push tickets directly to Atlassian, no middleware required.',
  },
  {
    icon: KeyRound,
    title: 'Developer Settings',
    description:
      'Self-serve API key generation with show-once reveal and instant revocation.',
  },
  {
    icon: LayoutDashboard,
    title: 'Multi-Tenant Workspaces',
    description:
      'Each product team operates in an isolated workspace with role-based access for Product Owners and their customers.',
  },
]

const FeaturesSection = () => (
  <section
    id="features"
    className="border-t border-slate-100 bg-slate-50 py-20 dark:border-slate-800 dark:bg-slate-900">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="mb-14 max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-500">
          Platform features
        </p>

        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 sm:text-4xl">
          Everything a product team needs
        </h2>

        <p className="mt-4 text-base text-slate-500 dark:text-slate-400">
          Each feature maps directly to a stage in your feedback-to-backlog pipeline.
        </p>
      </div>

      <div className="grid gap-px rounded-2xl border border-slate-200 bg-slate-200 dark:border-slate-700 dark:bg-slate-700 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="group flex flex-col gap-4 bg-white p-6 transition-colors hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/80 first:rounded-tl-2xl sm:last:rounded-br-2xl"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-brand-500 transition-colors group-hover:border-brand-200 group-hover:bg-brand-50 dark:border-slate-700 dark:bg-slate-800 dark:group-hover:border-brand-800 dark:group-hover:bg-brand-950/40">
              <Icon size={18} strokeWidth={1.75} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default FeaturesSection
