# Multi-Agent AI Platform

<img width="1531" height="924" alt="01 - Homepage" src="https://github.com/user-attachments/assets/1668d9dd-e2b6-4077-9206-9392d5206ec4" />

A full-stack platform for automating business workflows through orchestration of specialized AI agents. Each agent can utilize tools (APIs, databases, calendar, email) and collaborate with other agents to complete complex tasks.

## 🚀 Key Features

### 🤖 AI & Multi-Agent Orchestration

- **Specialized AI Agents**: Create agents with specific roles (research, reporting, email, operations)
- **Function Calling**: Native integration with OpenAI function calling for tool execution
- **Multi-Agent Workflows**: Sequential orchestration of agents with output passing between steps
- **Extensible Tool Layer**: Modular system for integrating new tools (web search, email, calendar, database)
- **Intelligent Orchestrator**: LLM that decides which agents and tools to call based on context

### 🔧 Integrated Tools

- **Web Search**: Advanced web search via Tavily API
- **Email**: Email sending via SMTP or API providers (Resend, SendGrid, Mailgun)
- **Calendar**: Google Calendar integration with OAuth for reading and creating events
- **Database Operations**: Secure APIs for database operations (typed queries, no raw SQL)

### 📊 Workflow Engine

- **Workflow Builder**: Visual interface for creating multi-step workflows
- **Asynchronous Execution**: Support for long-running workflows with detailed logging
- **Run Viewer**: Step-by-step visualization of executions with tool calls and results
- **Error Handling**: Robust error handling with retry and structured logging

### 🔐 Security & Enterprise Features

- **Multi-Provider Authentication**: Email/password and Google OAuth
- **Row Level Security (RLS)**: Database-level security with Supabase
- **Rate Limiting**: API protection with Upstash Redis
- **CSRF Protection**: Protection against CSRF attacks
- **Security Logging**: Centralized logging of security events
- **Credential Encryption**: AES-256-GCM encryption for user credentials

### 💳 Subscription Management

- **Subscription Plans**: Trial, Basic, Premium with automatic management
- **Stripe Integration**: Secure payments with Stripe
- **Auto-Disable**: Automatic account disabling for expired subscriptions
- **Email Notifications**: Automatic notifications for expirations and deactivations

### 📈 Monitoring & Logging

- **Structured Logging**: Centralized logging system with categories
- **Security Events**: Tracking of unauthorized access attempts
- **Performance Metrics**: Execution metrics for agents and workflows
- **Error Tracking**: Detailed error tracking with stack traces

## 🛠️ Technology Stack

### AI & Machine Learning
- **OpenAI GPT-4/GPT-4o-mini**: LLM models for orchestration and specialized agents
- **Function Calling**: Native OpenAI integration for tool execution
- **Multi-Agent Framework**: Orchestration system for collaborative agents

### Frontend
- **Next.js 16** (App Router): React framework with SSR/SSG
- **React 19**: UI library with React Compiler
- **TypeScript**: End-to-end type safety
- **Tailwind CSS 4**: Utility-first styling
- **shadcn/ui**: Accessible and customizable UI components
- **Radix UI**: Headless UI primitives
- **React Hook Form**: Performant form management
- **Zod**: Runtime schema validation

### Backend
- **Next.js API Routes**: Serverless APIs
- **Server Actions**: Type-safe server-side mutations
- **Supabase**: Backend-as-a-Service (PostgreSQL, Auth, Storage)
- **PostgreSQL**: Relational database with RLS

### Integrations & Services
- **Stripe**: Payments and subscription management
- **Upstash Redis**: Distributed rate limiting
- **Tavily API**: Advanced web search
- **Google Calendar API**: Calendar integration
- **Nodemailer**: SMTP email sending

### Security & Performance
- **Supabase Auth**: Authentication and authorization
- **AES-256-GCM**: Credential encryption
- **CSRF Tokens**: Form protection
- **Rate Limiting**: API protection
- **Security Headers**: CSP, HSTS, X-Frame-Options
- **Input Validation**: Input sanitization and validation

### DevOps & Tools
- **ESLint**: Code linting
- **Jest**: Testing framework
- **TypeScript**: Type checking
- **Git**: Version control

## 📋 Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Supabase account
- OpenAI account (with API key)
- (Optional) Stripe account for payments
- (Optional) Tavily account for web search
- (Optional) Google Cloud account for Calendar API

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd multi-agent-ai-platform
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin (for bootstrap)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_password

# Email (optional - SMTP or API provider)
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM_EMAIL=your_email@gmail.com

# Or for API provider:
# EMAIL_PROVIDER=resend
# EMAIL_API_KEY=your_resend_api_key
# EMAIL_FROM=noreply@yourdomain.com

# Web Search (optional)
TAVILY_API_KEY=your_tavily_api_key

# Stripe (optional - for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Rate Limiting (optional - Upstash Redis)
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# CSRF (optional - uses NEXT_PUBLIC_SUPABASE_ANON_KEY as fallback)
CSRF_SECRET=your_csrf_secret
```

### 4. Setup Database

Run Supabase migrations:

```bash
# Use Supabase CLI or dashboard to run migrations in supabase/migrations/
```

### 5. Create admin user

```bash
npm run bootstrap:admin
```

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Useful Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Production build
npm run start           # Start production server
npm run lint            # Code linting

# Testing
npm run test            # Run tests
npm run test:watch      # Tests in watch mode
npm run test:coverage   # Coverage report

# Database & Config
npm run bootstrap:admin # Create admin user
npm run seed:demo       # Populate database with demo data
npm run verify:supabase # Verify Supabase connection
npm run check:email     # Verify email configuration
npm run debug:db        # Database debugging

# Workflow & Logging
npm run test:workflow   # Test workflow engine
npm run test:logging    # Test logging system
```

## 🏗️ Architecture

### Project Structure

```
multi-agent-ai-platform/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (app)/             # Protected user routes
│   │   ├── (admin)/           # Protected admin routes
│   │   ├── api/               # API routes
│   │   └── auth/              # Authentication
│   ├── components/            # React components
│   │   ├── agents/            # Agent UI
│   │   ├── workflows/         # Workflow UI
│   │   └── ui/               # shadcn/ui components
│   ├── lib/                   # Business logic
│   │   ├── ai/               # AI orchestrator
│   │   ├── agents/           # Agent management
│   │   ├── workflows/        # Workflow engine
│   │   ├── tools/            # Tool layer
│   │   ├── auth/             # Authentication
│   │   ├── security/          # Security
│   │   └── logging/           # Logging
│   ├── hooks/                 # React hooks
│   ├── types/                 # TypeScript types
│   └── utils/                 # Utility functions
├── supabase/
│   └── migrations/            # Database migrations
├── scripts/                   # Utility scripts
└── public/                   # Static files
```

### Workflow Execution Flow

1. **User Input**: User initiates a workflow with initial input
2. **Workflow Engine**: Reads workflow definition (steps, edges)
3. **Step Execution**: For each step:
   - Loads agent configuration
   - Calls AI orchestrator with available tools
   - LLM decides which tools to call
   - Executes tool calls
   - Passes output to next step
4. **Logging**: Records each step, tool call, and result
5. **Completion**: Returns final result to user

## 🔒 Security

- **Row Level Security (RLS)**: Each user sees only their own data
- **Rate Limiting**: Protection against API abuse
- **CSRF Protection**: HMAC-signed tokens for forms
- **Input Validation**: Input validation and sanitization with Zod
- **Credential Encryption**: AES-256-GCM encryption for OAuth tokens
- **Security Headers**: CSP, HSTS, X-Frame-Options
- **Error Sanitization**: No sensitive information exposed in production

## Screenshots

<img width="1531" height="924" alt="01 - Homepage" src="https://github.com/user-attachments/assets/85c7c25d-85d7-44b1-9fc7-77e9d7b575e1" />
<img width="1531" height="924" alt="02 - Features" src="https://github.com/user-attachments/assets/35b70327-cd02-4614-a803-6616cd6d0099" />
<img width="1531" height="924" alt="03 - How it works" src="https://github.com/user-attachments/assets/b76bdfe5-db3c-4a7a-9581-116f5ace1f7d" />

Homepage with features summary and workflow explanation


<img width="1531" height="924" alt="04 - Dashboard" src="https://github.com/user-attachments/assets/15cc0c82-7101-4a95-9a43-83360d55b31d" />

Dashboard for logged users


<img width="1531" height="924" alt="05 - Agents page" src="https://github.com/user-attachments/assets/fbbd0f5e-4772-4d1a-82b6-85a7d267102b" />
<img width="1531" height="924" alt="06 - Agent creation" src="https://github.com/user-attachments/assets/6d459cc1-214f-4591-a6e4-495c0cda608b" />
<img width="1531" height="924" alt="07 - test agent" src="https://github.com/user-attachments/assets/18c08913-4de0-457f-9f31-2fc5d0b27d5a" />

Agents page, creation and interaction


<img width="1531" height="924" alt="08 - Workflows page" src="https://github.com/user-attachments/assets/127c25c6-73d2-4054-a61b-41c663fdc204" />
<img width="1531" height="924" alt="09 - Workflow creation" src="https://github.com/user-attachments/assets/ef1163ef-ded9-4dc7-a647-9a5a72a8339d" />
<img width="1531" height="924" alt="10 - Workflow run" src="https://github.com/user-attachments/assets/ad7045b0-f37f-4ede-9b40-660dc37e1135" />

Workflows page, creation and run starting


<img width="1531" height="924" alt="12 - Workflow Runs page" src="https://github.com/user-attachments/assets/57ebc3a5-f2c3-42fc-b492-55189c34ad0c" />
<img width="1531" height="924" alt="13 - Workflow run details" src="https://github.com/user-attachments/assets/d3a5f712-a273-46f7-aced-8f151e397f12" />

Runs page and details


<img width="1531" height="924" alt="14 - Integrations" src="https://github.com/user-attachments/assets/9e284fa5-8481-45f2-961c-d1452d11bfad" />

Integration with external services and tools


<img width="1531" height="924" alt="15 - Plans" src="https://github.com/user-attachments/assets/a27aa42a-4496-47b4-b251-3a260a4ba339" />

Complete subscription plans to match each user specific needs



<img width="1531" height="924" alt="16 - Help Center" src="https://github.com/user-attachments/assets/e9872004-ff04-480f-84f2-596188157350" />

Comprehensive Help Center



<img width="1531" height="924" alt="17 - Profile" src="https://github.com/user-attachments/assets/2e84270d-4ae2-4ebc-ac34-5cdac42bb17c" />
<img width="1531" height="924" alt="18 - User Settings" src="https://github.com/user-attachments/assets/be4a629e-4373-4a5d-95b7-22aa29aeee83" />

User Profile and Settings




## 📝 License

This project is proprietary software. All rights reserved.

The source code is provided for use with the Multi-Agent AI Platform service. You may use this software in accordance with your subscription plan (Trial, Basic, or Premium). Redistribution, modification, or commercial use of this codebase is prohibited without explicit written permission.

For licensing inquiries, please contact: gianmarioiamoni1@gmail.com

## 📧 Support

For support, questions, or feature requests, please contact:

**Email**: gianmarioiamoni1@gmail.com
