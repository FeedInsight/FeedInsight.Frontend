# FeedInsight Frontend

Single React (JavaScript) + Vite application serving **both** FeedInsight
portals described in the platform README:

- **Customer Portal** — public, stateless, tenant-scoped feedback submission form.
- **Admin Portal** — JWT-authenticated control center: AI analytics dashboard,
  category management, backlog review workspace, AI Product Assistant chat,
  tenant/Jira settings, and admin user management.

One project, one `package.json`, one build — not two separate apps — matching
the request to keep everything unified. Angular was swapped for **React +
JavaScript** throughout; Vite is the build tool.

---

## Stack

| Concern            | Choice                                   |
|---------------------|-------------------------------------------|
| Build tool          | Vite 5                                    |
| UI library          | React 18 (JS, no TypeScript)              |
| Routing             | react-router-dom v6                       |
| Server state         | @tanstack/react-query v5                  |
| Client/UI state     | zustand (auth, tenant, ui stores)          |
| Forms + validation  | react-hook-form + zod                     |
| HTTP client         | axios (single shared instance)            |
| Styling             | Tailwind CSS                              |
| Charts              | recharts                                  |
| Icons               | lucide-react                              |
| Toasts              | react-hot-toast                           |

## Getting started

```bash
npm install
cp .env.example .env      # then fill in VITE_API_BASE_URL etc.
npm run dev
```

Build: `npm run build`. Preview a production build: `npm run preview`.

## Architecture

The codebase mirrors the backend's Clean Architecture / CQRS vertical-slice
philosophy, translated to frontend conventions:

```
src/
├── app/            # bootstrap: env & constants, global stores, providers
├── router/          # route table, path constants, auth guard
├── shared/          # cross-feature building blocks (ui kit, api client, layouts, hooks, utils)
├── features/        # one folder per vertical slice (see below)
└── styles/          # Tailwind entry + global overrides
```

### Feature slices (`src/features/<name>/`)

Each feature is self-contained with the same four sub-folders:

- `api/` — axios calls, one function per backend endpoint, importing paths
  from `shared/api/endpoints.js`. No React here.
- `hooks/` — React Query (`useQuery`/`useMutation`) wrappers around `api/`.
  Components never call `api/` functions directly.
- `components/` — presentational + mid-level components specific to this
  feature. Shared, feature-agnostic primitives live in `shared/components/ui`
  instead.
- `pages/` — top-level route targets, registered in `router/AppRouter.jsx`.
  Pages only compose components and hooks; no business logic inline.

Slices, mapped to the backend domain:

| Feature            | Backend counterpart                                   |
|---------------------|--------------------------------------------------------|
| `customerPortal`    | Public feedback ingestion (`CustomerFeedbacks`)         |
| `auth`              | `AdminUsers` JWT login                                  |
| `dashboard`         | `DailyAnalyticsSnapshots`                                |
| `categories`        | `Categories`                                             |
| `backlog`           | `UserStories`, `ExtractedTasks`, Qdrant duplicate search |
| `chat`              | `ChatSessions`, `ChatMessages` (AI Product Assistant)    |
| `tenantSettings`    | `Tenants` (Jira connection, webhook secret)              |
| `adminUsers`        | `AdminUsers` management                                  |

### Why this avoids merge conflicts across contributors

- **One feature = one folder.** Two people working on different features
  (e.g. `backlog` vs `chat`) never touch the same file.
- **`shared/api/endpoints.js` is the only shared "hot" file for API routes** —
  additions are append-only per feature block, minimizing collision surface.
- **`router/AppRouter.jsx` and `AdminSidebar.jsx`** are the only two files a
  new page must touch outside its own feature folder — keep new-page PRs to
  "add my feature folder + one line in each of these two files."
- State is split by *kind*, not by feature: server data always goes through
  React Query (feature-owned cache keys in `app/config/constants.js`
  `QUERY_KEYS`), client/UI state always goes through one of the three
  zustand stores in `app/store/`. This prevents the classic conflict of two
  people both inventing their own ad-hoc global state solution.

## Environment variables

See `.env.example`. `VITE_API_BASE_URL` must point at `FeedInsight.WebApi`.
`VITE_DEV_TENANT_ID` is a local-only convenience so the Customer Portal has
a tenant context before real tenant-resolution-by-subdomain is implemented
(see `features/customerPortal/components/TenantResolver.jsx` for the TODO).

## Multi-tenancy

Every outgoing request automatically gets an `X-Tenant-Id` header injected
by `shared/api/axiosClient.js`'s request interceptor, reading from
`app/store/tenantStore.js`. Feature code should never set this header
manually.

## Auth

JWT stored in `app/store/authStore.js` (persisted to localStorage),
attached as `Authorization: Bearer <token>` by the same axios interceptor.
`router/ProtectedRoute.jsx` guards all `/admin/*` routes; a subset
(`Tenant Settings`, `Admin Users`) is further restricted by role via
`shared/constants/roles.js`.

## Not yet wired to a real backend

Several files contain `TODO` comments where the backend contract wasn't
fully specified in the platform README (e.g. tenant-key-to-GUID lookup,
top-requested-features aggregation, duplicate-story linking action). These
are flagged inline rather than guessed at, to avoid baking in incorrect
assumptions.
