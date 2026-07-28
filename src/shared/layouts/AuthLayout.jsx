import { Outlet } from 'react-router-dom'

/** Centered, chrome-free layout for /login and any future auth screens
 * (password reset, invite acceptance) in the Admin Portal. */
export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-8 shadow-sm">
        <Outlet />
      </div>
    </div>
  )
}
