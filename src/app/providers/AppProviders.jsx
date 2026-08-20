import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import QueryProvider from './QueryProvider.jsx'
import ThemeProvider from './ThemeProvider.jsx'

/**
 * Composes every app-wide provider in one place. Add new global providers
 * (theme, i18n, feature flags) here, wrapped in the correct order, so
 * App.jsx never has to change when the provider tree grows.
 */
export default function AppProviders({ children }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <BrowserRouter>
          {children}
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        </BrowserRouter>
      </ThemeProvider>
    </QueryProvider>
  )
}
