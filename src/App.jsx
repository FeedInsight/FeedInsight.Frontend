import AppProviders from '@app/providers/AppProviders.jsx'
import AppRouter from '@router/AppRouter.jsx'
import { Toaster } from 'react-hot-toast'

/**
 * Root component. Composition root only: wrap the router with every global
 * provider (React Query client, toast portal, future theme/i18n providers).
 * Do not add routes, layout markup, or fetching logic in this file.
 */
export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </>
  )
}
