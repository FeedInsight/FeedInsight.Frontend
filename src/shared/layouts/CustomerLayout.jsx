import { Outlet } from 'react-router-dom'
import ErrorBoundary from '@shared/components/ErrorBoundary.jsx'

export default function CustomerLayout() {
  return (
    <main className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
      <ErrorBoundary>
        <div className="mx-auto w-full max-w-7xl">
          <Outlet />
        </div>
      </ErrorBoundary>
    </main>
  )
}
