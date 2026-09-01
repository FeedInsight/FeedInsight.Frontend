# FeedInsight

**AI-Powered Product Intelligence & Backlog Automation** — A unified React frontend serving both a public Customer Feedback Portal and a secured Admin Workspace, enabling product teams to collect feedback, triage AI-extracted insights, manage backlogs, and sync directly to Jira.

## Features

- **AI-Powered Triage** — Automatically processes customer feedback to extract product tasks, sentiment, and categorization using Semantic Kernel + GPT-4o mini
- **Backlog Review Workspace** — Review AI-generated user stories, edit acceptance criteria, approve/reject workflows, and detect duplicates via Qdrant vector search
- **AI Product Assistant Chat** — Conversational AI chat with retrieval-augmented generation (RAG) powered by Qdrant embeddings, SQL history, and GPT-4o mini
- **Jira Integration** — Bidirectional sync: configure Jira credentials, publish approved stories as issues, and receive webhook updates
- **Analytics Dashboard** — Real-time KPI cards, sentiment trend charts (Recharts), and top requested features aggregated from AI analysis
- **Multi-Role Portal** — Role-based access for Super Admins, Product Owners, and Company Customers with dedicated layouts and permissions
- **Customer Feedback Portal** — End-user feedback submission with AI triage categorization, submission history, and team response tracking
- **Dark Mode** — Full class-based dark theme with manual toggle and persistent preference
- **Multi-Tenancy** — Tenant isolation via automatic `X-Tenant-Id` header injection on every API request
- **API Key Management** — Generate, revoke, and manage ingestion API keys with embedded code snippets for external feedback pipelines

## Project Demo

Watch the full demo video here:

```text
https://drive.google.com/file/d/1Q606wLIFDvU8GjAN2E1ZjAyTm5-bc44x/view?usp=sharing
```

## Tech Stack & Architecture

| Category | Technology |
| :--- | :--- |
| Framework | React 18 (JavaScript) |
| Build Tool | Vite 5 |
| Routing | React Router v6 |
| Server State | TanStack React Query v5 |
| Client State | Zustand |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios (with interceptors & token refresh) |
| Styling | Tailwind CSS 3 (class-based dark mode) |
| Charts | Recharts |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Dates | date-fns |
| AI Backend | Semantic Kernel + GPT-4o mini + Qdrant Vector DB |
| Backend API | ASP.NET Core Web API (Clean Architecture / CQRS) |
| Deployment | Vercel (SPA rewrite) |

### Architecture

```text
src/
├── app/                 # Config, providers, Zustand stores
│   ├── config/          # Constants, query keys, route paths
│   ├── providers/       # Composable AppProviders (Router, Query, Theme)
│   └── store/           # authStore, tenantStore, uiStore
├── features/            # 14 vertical-slice feature modules
│   ├── adminUsers/      # Super Admin user management
│   ├── apiSettings/     # API key management
│   ├── auth/            # JWT login & registration
│   ├── backlog/         # User story review & approval
│   ├── categories/      # Feedback category CRUD
│   ├── chat/            # AI Product Assistant
│   ├── customerFeedback/# Customer feedback submission & review
│   ├── customers/       # Company customer management
│   ├── dashboard/       # Analytics dashboard
│   ├── jira/            # Jira integration settings
│   ├── landing/         # Public marketing page
│   ├── settings/        # Account & organization settings
│   ├── tenantsDirectory/# Super Admin tenant directory
│   └── triage/          # AI Triage Inbox
├── router/              # AppRouter, ProtectedRoute, route config
├── shared/              # Cross-cutting: API client, UI kit, hooks, utils
├── styles/              # Global CSS & dark mode overrides
└── assets/              # Static assets
```

Each feature module follows the **vertical-slice pattern**: `api/`, `hooks/`, `components/`, `pages/` — ensuring no cross-feature file dependencies.

## Setup & Installation

```bash
# 1. Clone the repository and install dependencies
git clone https://github.com/YOUR_ORG/FeedInsight.Frontend.git
cd FeedInsight.Frontend
npm install

# 2. Configure environment variables
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL to your backend API

# 3. Start the development server
npm run dev
```

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start Vite dev server on `http://localhost:5173` |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

### Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Backend API base URL (no trailing slash) | `https://localhost:7001/api` |
| `VITE_DEV_TENANT_ID` | Default tenant GUID for local dev | `00000000-...` |
| `VITE_INGESTION_API_KEY` | Default API key for feedback ingestion | _(empty)_ |
| `VITE_USE_MOCKS` | Toggle mock API mode (`true`/`false`) | `false` |

### Role-Based Routes

| Role | Default Redirect | Portal |
| :--- | :--- | :--- |
| `SuperAdmin` | `/super-admin/tenants` | Platform administration |
| `ProductOwner` | `/workspace/dashboard` | Product management workspace |
| `CompanyCustomer` | `/customer/feedback` | Customer feedback portal |