const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Collect feedback',
    description:
      'Customers submit feedback through a dedicated portal. Every entry lands in the triage inbox, tagged and ready for review.',
  },
  {
    step: '02',
    title: 'Triage & respond',
    description:
      'Categorize feedback by theme, priority, or sentiment. Reply directly from the inbox to close the customer loop quickly.',
  },
  {
    step: '03',
    title: 'Generate stories',
    description:
      'The AI assistant surfaces recurring themes and proposes ready-to-refine user stories, cutting discovery time significantly.',
  },
  {
    step: '04',
    title: 'Push to Jira',
    description:
      'Approved backlog items flow directly into your Atlassian project as structured tickets, keeping planning and execution in sync.',
  },
]

const WorkflowSection = () => (
  <section
    id="workflow"
    className="border-t border-slate-100 bg-white py-20 dark:border-slate-800 dark:bg-slate-950">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="mb-14 max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-500">
          How it works
        </p>

        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 sm:text-4xl">
          From raw feedback to shipped tickets
        </h2>

        <p className="mt-4 text-base text-slate-500 dark:text-slate-400">
          A structured, four-step loop that keeps your team focused on building the right things.
        </p>
      </div>

      <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div
          className="absolute top-5 left-0 hidden h-px w-full bg-slate-100 dark:bg-slate-800 lg:block"
          style={{ zIndex: 0 }}
        />

        {WORKFLOW_STEPS.map(({ step, title, description }) => (
          <li key={step} className="relative flex flex-col gap-4" style={{ zIndex: 1 }}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-bold tabular-nums text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500">
              {step}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
)

export default WorkflowSection
