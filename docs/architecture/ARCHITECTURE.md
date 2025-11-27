# Multi-Agent AI Platform - Architecture Documentation

## Overview

This document describes the technical architecture of the Multi-Agent AI Platform, a full-stack application for orchestrating multiple AI agents to automate business workflows.

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (to be installed)
- **State Management**: SWR / React Query

### Backend
- **API**: Next.js API Routes & Server Actions
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage (future)

### AI & Integrations
- **LLM**: OpenAI (GPT-4)
- **Email**: Resend / SendGrid
- **Calendar**: Google Calendar API
- **Search**: Tavily / SerpAPI

## Project Structure

```
multi-agent-ai-platform/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (admin)/           # Admin-only routes
│   │   ├── (app)/             # Authenticated user routes
│   │   ├── auth/              # Authentication pages
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/               # UI components (shadcn/ui)
│   │   ├── auth/             # Auth-related components
│   │   ├── agents/           # Agent-related components
│   │   └── workflows/        # Workflow-related components
│   ├── lib/                   # Utility libraries
│   │   ├── supabase/         # Supabase clients
│   │   ├── auth/             # Auth utilities
│   │   ├── ai/               # AI/LLM utilities
│   │   └── tools/            # Tool implementations
│   ├── hooks/                 # Custom React hooks (28 hooks)
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # General utilities (pure functions)
├── supabase/
│   └── migrations/           # Database migrations
├── docs/                      # Documentation
└── tests/                     # Test files

```

## Authentication & Authorization

### Authentication Providers
1. **Email/Password**: Native Supabase auth
2. **Google OAuth**: OAuth 2.0 via Supabase

### Role-Based Access Control (RBAC)

#### Roles
- **user** (default): Can create and manage own agents and workflows
- **admin**: Full access including:
  - View all workflow runs
  - Manage global tool configurations
  - Monitor errors and system health
  - Manage user permissions

#### Implementation
- Roles stored in `profiles` table
- RLS policies enforce access control at database level
- Middleware protects routes based on authentication status
- Server-side utilities (`requireAuth`, `requireAdmin`) for page protection

### Supabase Client Architecture

We use multiple Supabase client instances based on context:

#### 1. Client Component (`src/lib/supabase/client.ts`)
- Used in 'use client' components
- Browser-side operations
- Cookie-based session management

#### 2. Server Component (`src/lib/supabase/server.ts`)
- Used in Server Components and Server Actions
- Server-side operations with cookie access
- Automatic session refresh

#### 3. Middleware (`src/lib/supabase/middleware.ts`)
- Used in Next.js middleware
- Session refresh for protected routes
- Route protection logic

#### 4. Admin Client (`src/lib/supabase/admin.ts`)
- Uses service role key
- Bypasses RLS policies
- Admin operations only
- **Never expose to client**

## Database Schema

### Current Schema (Sprint 1)

#### profiles
Stores user profile information and roles.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT,
  role user_role NOT NULL DEFAULT 'user',
  settings JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### Current Schema (Sprint 2+)

#### agents
Configuration for AI agents.
- Fields: id, owner_id, name, description, role, model, temperature, max_tokens, tools_enabled[], config, status, created_at, updated_at

#### workflows
Multi-agent workflow definitions.
- Fields: id, owner_id, name, description, graph (steps, edges, triggers), status, created_at, updated_at, last_run_at

#### workflow_runs
Execution history of workflows.
- Fields: id, workflow_id, status, started_at, finished_at, created_by, input, output, error

#### agent_runs
Individual agent executions within workflow runs.
- Fields: id, workflow_run_id, agent_id, agent_name, step_index, status, started_at, finished_at, input, output, error, tool_invocations

#### tool_invocations
Log of all tool calls made by agents.
- Fields: id, agent_run_id, tool_name, parameters, result, status, started_at, finished_at, error

#### stored_credentials
Encrypted OAuth tokens and API keys.
- Fields: id, user_id, provider, encrypted_credentials, created_at, updated_at

#### tool_configs
Global tool configurations (admin-managed).
- Fields: id, tool_name, enabled, config (JSONB), created_at, updated_at

#### logs
Structured logging for system events.
- Fields: id, level, message, context, user_id, metadata, created_at

#### notification_reads
Track read status of notifications.
- Fields: id, user_id, notification_id, read_at

## Security Features

### Row Level Security (RLS)
All tables have RLS policies that enforce:
- Users can only access their own data
- Admins can access all data
- Service role can bypass for admin operations

### Environment Variables
- Public variables: `NEXT_PUBLIC_*` (safe to expose)
- Secret variables: Database keys, API keys (server-only)
- Never commit `.env.local` to git

### Authentication
- JWT tokens managed by Supabase
- Secure HTTP-only cookies
- Automatic token refresh
- PKCE flow for OAuth

## Code Style Guidelines

Following SOLID principles and functional programming:

### TypeScript Rules
- ✅ **Always** use TypeScript
- ❌ **Never** use `any` type (ESLint enforced)
- ✅ Use explicit types or type inference
- ✅ Use `type` over `interface` when possible

### React Component Rules
- ✅ Functional components only (no classes)
- ✅ Apply Single Responsibility Principle (SRP)
- ✅ Separate logic from UI
- ✅ Use Server Components by default
- ✅ Add `'use client'` only when necessary

### Code Quality
- ✅ No unused variables/functions (ESLint enforced)
- ✅ Use `const` over `let`, never `var`
- ✅ Prefer functional and declarative patterns
- ✅ Write descriptive variable names (e.g., `isLoading`, `hasError`)

### Testing
- ✅ TDD approach when possible
- ✅ Unit tests with Jest
- ✅ Integration tests for critical flows
- ✅ Test files co-located with source files

## Development Workflow

### Setup
```bash
# Install dependencies
pnpm install

# Setup Supabase (see SUPABASE_SETUP.md)
# Configure .env.local with your credentials

# Run development server
pnpm dev
```

### Git Workflow
- `main` branch: production-ready code
- Feature branches: `feature/sprint-X-description`
- Commit messages: Clear and descriptive

### Code Review Checklist
- [ ] No `any` types
- [ ] No unused variables
- [ ] Tests written and passing
- [ ] ESLint passes
- [ ] TypeScript compiles
- [ ] RLS policies correct
- [ ] Documentation updated

## Performance Considerations

### Server Components
- **Current State**: 52.4% Server Components, 47.6% Client Components
- Use Server Components for data fetching and static content
- Reduce client bundle size by ~9-17%
- Better SEO and initial load
- Pattern: Island Architecture for components requiring minimal interactivity

### Data Fetching
- Use SWR or React Query (not `useEffect`)
- Implement proper caching strategies
- Handle loading and error states

### Image Optimization
- Use Next.js `Image` component
- WebP format preferred
- Lazy loading enabled

## Monitoring & Logging

### Logging Strategy
- Structured logging to Supabase logs table
- Error tracking with context
- Performance metrics

### Observability
- Track workflow execution times
- Monitor tool invocation success rates
- Track API usage and costs

## Deployment

### Environment Variables
Production requires all variables from `.env.example`:
- Supabase credentials
- OpenAI API key
- Email service API key
- Search API key
- OAuth credentials

### Database Migrations
Apply migrations in order:
```bash
# Via Supabase Dashboard or CLI
supabase db push
```

## Next Steps

### Current Status

#### Completed Features
- ✅ **Sprint 1**: Auth, roles, base structure
- ✅ **Sprint 2**: Agents & workflows CRUD, Web search & Email tools
- ✅ **Sprint 3**: Multi-agent workflows, Calendar tool, DB operations tool
- ✅ **Sprint 4**: Rate limiting, structured logging, error handling, UI improvements, demo workflows

#### Performance Optimizations
- ✅ **SSR Optimization**: 23 components converted to Server Components
- ✅ **Bundle Reduction**: ~9-17% JavaScript bundle size reduction
- ✅ **Hook Conversion**: 5 hooks converted to pure utility functions

### Next Steps
See `CLAUDE.md` for full roadmap and upcoming features.

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

