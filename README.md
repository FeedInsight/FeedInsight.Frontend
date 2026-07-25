# FeedInsight — Frontend (React / JavaScript)

Single-project React frontend implementing BOTH FeedInsight portals described in the platform README:

1. **Customer Portal** — public, stateless feedback ingestion form (`/feedback`, tenant-scoped).
2. **Admin Portal** — authenticated Product Owner workspace: Dashboard, Categories, Backlog Review, AI Product Assistant chat, Settings (`/admin/*`).

This is a **structural scaffold**: every file below contains a header comment describing its exact responsibility, the props/state it owns, and which API endpoints it talks to, so implementation can proceed without naming collisions or overlapping responsibilities. Business logic (API calls, validation rules, chart data shaping) is left as `// TODO:` markers to be filled in against the real FeedInsight.WebApi contracts.

## Getting started

```bash
npm install
cp .env.example .env    # fill in REACT_APP_API_BASE_URL etc.
npm start
```

## High-level architecture

- **`src/api/`** — the ONLY layer allowed to call `axios` / talk to the backend. Every other layer (components, pages, store) imports from here, never from `axios` directly.
- **`src/store/`** — Redux Toolkit slices holding server-derived state (auth, stories, categories, chat, analytics). Local-only UI state (e.g. "is this modal open") stays in component `useState`, not Redux.
- **`src/context/`** — cross-cutting concerns that are not really "domain state": current authenticated user session, active tenant, global toast notifications.
- **`src/components/common/`** — dumb, reusable, presentation-only UI primitives. No API calls. No Redux. Props in, JSX out.
- **`src/components/customerPortal/`** and **`src/components/adminPortal/`** — feature-specific composite components. May read from Redux/Context, may call `src/api`.
- **`src/pages/`** — route-level components. Compose feature components together, own page-level data fetching (via hooks), and pass data down.
- **`src/routes/`** — React Router route table + guarding logic.
- **`src/hooks/`** — reusable stateful logic extracted out of components.
- **`src/utils/`** — pure functions only (no React, no side effects beyond localStorage helpers).

## Naming & ownership conventions (read before adding files)

- One React component = one file = one default export, filename matches component name (`StoryCard.jsx` exports `StoryCard`).
- Co-locate a component's CSS Module next to it: `Button.jsx` + `Button.module.css`.
- Never call `fetch`/`axios` outside `src/api/*Api.js` files.
- Never mutate Redux state outside the slice that owns it — cross-slice updates go through thunks, not direct imports of another slice's reducer.
- All backend-facing DTO shapes referenced in comments mirror the SQL schema in the platform README (`CustomerFeedbacks`, `ExtractedTasks`, `UserStories`, `Categories`, `ChatSessions`, `ChatMessages`, `DailyAnalyticsSnapshots`).
- Multi-tenancy: every authenticated API call must include the resolved tenant context; see `src/api/axiosClient.js` and `src/context/TenantContext.jsx`.

## Tech choices made for this scaffold

| Concern | Choice | Why |
|---|---|---|
| Routing | `react-router-dom` v6 | standard, supports nested/protected routes |
| Server state mutations & shared domain state | Redux Toolkit | predictable, devtools, matches multi-page Admin Portal complexity |
| Forms | `react-hook-form` | uncontrolled, performant, minimal re-renders for the feedback form |
| Charts | `recharts` | matches "Sentiment Trends" / KPI dashboard needs |
| HTTP | `axios` | interceptors for JWT + X-Tenant-Id headers |
| Styling | CSS Modules | scoped styles, no extra runtime dependency, works with plain JS/React |

These are defaults for a clean, conflict-free structure — swap freely (e.g. CSS Modules → Tailwind) as long as the layering rules above are respected.
