import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 bg-white dark:bg-slate-950 overflow-hidden">

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-500/5" />
      <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-brand-500/5" />

      <div className="relative w-full max-w-xl rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-8 shadow-xl shadow-slate-200/60 dark:shadow-slate-950/60 border border-slate-200/60 dark:border-slate-800">
        <Outlet />
      </div>
    </div>
  )
}
