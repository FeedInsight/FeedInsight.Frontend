import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 dark:bg-slate-950">
      <div className="w-full max-w-xl rounded-xl bg-white p-8 shadow-sm">
        <Outlet />
      </div>
    </div>
  )
}
