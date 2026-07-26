import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

/**
 * Single QueryClient instance for the whole app. Server-state (anything
 * that comes from the Web API: feedbacks, stories, categories, chat
 * messages, analytics snapshots) is managed exclusively through React Query
 * hooks in each feature's hooks/ folder -- never duplicated into a zustand
 * store. Zustand (see app/store) is reserved for pure client/UI state
 * (auth session, active tenant, sidebar open/closed, active chat session id).
 *
 * Default options here are intentionally conservative: retries are limited
 * because most failures are 4xx (auth/tenant errors) that a retry won't fix.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})

export default function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
