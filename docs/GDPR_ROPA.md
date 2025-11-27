# Records of Processing Activities (ROPA)
## Article 30 GDPR Compliance

**Last Updated**: December 2024

**Data Controller**: Multi-Agent AI Platform

---

## 1. CONTROLLER INFORMATION

- **Name**: Multi-Agent AI Platform
- **Contact Email**: See ADMIN_EMAIL environment variable or Privacy Policy
- **Data Protection Officer**: Contact via email (see Privacy Policy)

---

## 2. PROCESSING ACTIVITIES

### 2.1 User Account Management

**Purpose of Processing**: 
- User authentication and authorization
- Account creation and management
- Profile information management
- Role-based access control

**Categories of Data Subjects**: 
- Registered users
- Administrators

**Categories of Personal Data**:
- Email address (auth.users.email)
- Name (profiles.name)
- User ID (auth.users.id, profiles.user_id)
- Role (profiles.role: 'user' | 'admin')
- Settings and preferences (profiles.settings - JSONB)
- Account creation/update timestamps
- Demo user flag (profiles.is_demo)
- Account disabled status (profiles.is_disabled)

**Legal Basis**: 
- Contract (Article 6(1)(b)) - Necessary for service provision
- Legitimate Interests (Article 6(1)(f)) - Account management and security

**Recipients**:
- Internal system only
- Supabase (authentication service provider)

**Retention Period**: 
- Active accounts: Until account deletion
- Deleted accounts: Data removed immediately upon deletion (CASCADE)
- Audit logs: 30 days

**Technical Measures**:
- Row Level Security (RLS) policies
- Encrypted authentication tokens
- Password hashing (bcrypt)
- Secure HTTP-only cookies

**Automated Decision-Making**: None

---

### 2.2 AI Agents and Workflows Management

**Purpose of Processing**: 
- Create and configure AI agents
- Define multi-agent workflows
- Store agent configurations and system prompts

**Categories of Data Subjects**: 
- Registered users (agents and workflows creators)

**Categories of Personal Data**:
- Agent configurations (agents table):
  - Agent name, description, role (system prompt)
  - AI model selection (gpt-4o, gpt-4o-mini, etc.)
  - Temperature and max_tokens settings
  - Enabled tools list
  - Additional config (JSONB)
  - Status (active, inactive, archived)
  - Creation/update timestamps
- Workflow configurations (workflows table):
  - Workflow name, description
  - Workflow graph structure (steps, edges, triggers - JSONB)
  - Status (draft, active, paused, archived)
  - Creation/update timestamps

**Legal Basis**: 
- Contract (Article 6(1)(b)) - Core service functionality

**Recipients**:
- Internal system only
- OpenAI API (when executing agents - agent configurations sent as prompts)

**Retention Period**: 
- Active agents/workflows: Until deleted by user or account deletion
- Deleted: Immediately removed (CASCADE on account deletion)

**Technical Measures**:
- RLS policies (users can only access their own agents/workflows)
- Data isolation by user_id

**Automated Decision-Making**: None

---

### 2.3 Workflow Execution and Agent Runs

**Purpose of Processing**: 
- Execute workflows and agent runs
- Track execution history
- Store input/output data for workflow steps
- Log tool invocations and results

**Categories of Data Subjects**: 
- Users who execute workflows

**Categories of Personal Data**:
- Workflow runs (workflow_runs table):
  - Workflow ID reference
  - Input text data
  - Output text data
  - Error messages
  - Execution timestamps
  - Status (pending, running, completed, failed, cancelled)
- Agent runs (agent_runs table):
  - Agent ID reference
  - Step order in workflow
  - Input/output text data
  - Error messages
  - Execution timestamps
  - Status (pending, running, completed, failed, skipped)
- Tool invocations (tool_invocations table):
  - Tool name (e.g., 'web_search', 'email', 'calendar')
  - Tool parameters (JSONB)
  - Tool results (JSONB)
  - Error messages
  - Execution time and timestamps
  - Status (pending, running, completed, failed)

**Legal Basis**: 
- Contract (Article 6(1)(b)) - Core service functionality

**Recipients**:
- Internal system only
- OpenAI API (agent execution - input/output may contain user data)
- Third-party APIs via tools (e.g., Tavily for web search, Nodemailer for email, Google Calendar API)

**Retention Period**: 
- Active runs: Retained indefinitely until user deletion
- Deleted: Immediately removed (CASCADE on account deletion)
- **Recommendation**: Implement automatic cleanup after 1 year for completed runs

**Technical Measures**:
- RLS policies (users can only access their own workflow runs)
- Data isolation by workflow ownership
- Structured logging for audit trail

**Automated Decision-Making**: 
- Agent execution decisions (AI-based) - Users initiate, but AI decides tool calls

---

### 2.4 Third-Party Integrations (OAuth Credentials)

**Purpose of Processing**: 
- Store encrypted OAuth tokens for third-party integrations
- Enable access to external services (Google Calendar, Gmail, etc.)

**Categories of Data Subjects**: 
- Users who connect third-party services

**Categories of Personal Data**:
- OAuth credentials (stored_credentials table):
  - Provider name (e.g., 'google_calendar')
  - Encrypted access tokens and refresh tokens (BYTEA - AES-256-GCM)
  - OAuth scopes granted
  - Token expiration dates
  - Active/inactive status
  - Creation/update timestamps
- **Note**: Encrypted data is not exported in GDPR exports for security

**Legal Basis**: 
- Consent (Article 6(1)(a)) - User explicitly connects integrations
- Contract (Article 6(1)(b)) - Required for integration functionality

**Recipients**:
- Internal system only (encrypted storage)
- Third-party OAuth providers (Google) for token refresh

**Retention Period**: 
- Active credentials: Until user disconnects or account deletion
- Deleted: Immediately removed (CASCADE on account deletion)

**Technical Measures**:
- AES-256-GCM encryption for stored tokens
- RLS policies
- Encryption key stored separately (CREDENTIALS_ENCRYPTION_KEY env var)

**Automated Decision-Making**: None

---

### 2.5 Application Logging and Monitoring

**Purpose of Processing**: 
- Debug and troubleshoot issues
- Monitor application performance
- Audit trail for security and compliance
- Error tracking and analysis

**Categories of Data Subjects**: 
- All users (logged automatically during service use)

**Categories of Personal Data**:
- Log entries (logs table):
  - Log level (debug, info, warn, error, critical)
  - Category (e.g., 'agent.execution', 'workflow.engine')
  - Log message
  - Context data (JSONB - may contain user data)
  - Error details (error_type, error_message, stack_trace)
  - Request ID for tracing
  - Execution duration
  - Timestamp
  - Related entity IDs (user_id, agent_id, workflow_id, etc.)

**Legal Basis**: 
- Legitimate Interests (Article 6(1)(f)) - System maintenance, security, debugging

**Recipients**:
- Internal system only
- Supabase (database hosting)

**Retention Period**: 
- Debug/Info logs: 30 days (automatic cleanup via clean_old_logs function)
- Error/Critical logs: 90 days
- **Note**: Only last 1000 logs exported in GDPR data export

**Technical Measures**:
- RLS policies (users can only see their own logs)
- Automatic cleanup function
- Structured logging format

**Automated Decision-Making**: None

---

### 2.6 Notifications and Read Status

**Purpose of Processing**: 
- Track which notifications users have read
- Manage notification display state

**Categories of Data Subjects**: 
- All users

**Categories of Personal Data**:
- Notification read status (notification_reads table):
  - Notification ID (e.g., 'workflow-{run_id}-completed')
  - Read timestamp
  - Creation timestamp

**Legal Basis**: 
- Legitimate Interests (Article 6(1)(f)) - User experience enhancement

**Recipients**:
- Internal system only

**Retention Period**: 
- Until account deletion (CASCADE)

**Technical Measures**:
- RLS policies
- Unique constraint per user/notification

**Automated Decision-Making**: None

---

### 2.7 Cookie Consent and Preferences

**Purpose of Processing**: 
- Manage cookie consent preferences
- Track user consent decisions
- Enable/disable cookie categories

**Categories of Data Subjects**: 
- All website visitors

**Categories of Personal Data**:
- Cookie preferences (localStorage, not database):
  - Necessary cookies (always true)
  - Analytics cookies (boolean)
  - Marketing cookies (boolean)
  - Consent timestamp

**Legal Basis**: 
- Consent (Article 6(1)(a)) - Explicit user consent

**Recipients**:
- Stored locally in user's browser (localStorage)

**Retention Period**: 
- Until user clears browser data or changes preferences

**Technical Measures**:
- Client-side storage only
- No server-side tracking without consent

**Automated Decision-Making**: None

---

## 3. DATA TRANSFERS

### 3.1 Internal Transfers

- **From**: User input → Database (Supabase)
- **Location**: Supabase hosting location (varies by region)
- **Safeguards**: 
  - Supabase compliance (SOC 2, GDPR compliant)
  - Data processing agreements

### 3.2 Third-Party Transfers

#### OpenAI API
- **Purpose**: AI agent execution
- **Data Transferred**: Agent configurations, user prompts, input/output data
- **Safeguards**: 
  - OpenAI Data Processing Agreement
  - No data retention by default (configurable)
  - API encryption in transit

#### Google OAuth Services (Calendar, Gmail)
- **Purpose**: Third-party integrations
- **Data Transferred**: OAuth tokens (encrypted), calendar events, emails
- **Safeguards**: 
  - Google OAuth consent
  - Encrypted token storage
  - Limited scope access

#### Email Service Provider (SMTP)
- **Purpose**: Email tool functionality
- **Data Transferred**: Email content, recipient addresses
- **Safeguards**: 
  - SMTP over TLS
  - Email service provider agreements

#### Web Search Provider (Tavily)
- **Purpose**: Web search tool
- **Data Transferred**: Search queries, results
- **Safeguards**: 
  - API encryption in transit
  - Provider data processing agreements

---

## 4. DATA RETENTION POLICIES

| Data Type | Retention Period | Cleanup Method |
|-----------|-----------------|----------------|
| User Profiles | Until account deletion | CASCADE delete |
| Agents/Workflows | Until account deletion | CASCADE delete |
| Workflow Runs | Indefinite (recommended: 1 year) | Manual/automatic cleanup |
| Agent Runs | Indefinite (recommended: 1 year) | Manual/automatic cleanup |
| Tool Invocations | Indefinite (recommended: 1 year) | Manual/automatic cleanup |
| Stored Credentials | Until user disconnects | CASCADE delete |
| Logs (Debug/Info) | 30 days | Automatic cleanup function |
| Logs (Error/Critical) | 90 days | Automatic cleanup function |
| Notification Reads | Until account deletion | CASCADE delete |
| Cookie Preferences | Until browser data cleared | Client-side only |

**Note**: Automatic cleanup functions should be scheduled (e.g., via cron jobs or Supabase Edge Functions).

---

## 5. SECURITY MEASURES

### Technical Measures
- Row Level Security (RLS) on all tables
- Encrypted credentials (AES-256-GCM)
- Secure authentication (JWT, HTTP-only cookies)
- HTTPS/TLS for all connections
- Environment variable protection
- API rate limiting

### Organizational Measures
- Access control (admin vs. user roles)
- Regular security audits
- Data breach notification procedures (to be implemented)
- Staff training on data protection

---

## 6. DATA SUBJECT RIGHTS IMPLEMENTATION

| Right | Implementation | Location |
|-------|---------------|----------|
| Right to Access (Art. 15) | Data export functionality | `/api/gdpr/export`, Account page |
| Right to Rectification (Art. 16) | Profile editing | Account page |
| Right to Erasure (Art. 17) | Account deletion | Account page, CASCADE deletes |
| Right to Restrict Processing (Art. 18) | Account disable feature | Admin panel |
| Right to Data Portability (Art. 20) | JSON export | `/api/gdpr/export` |
| Right to Object (Art. 21) | Cookie consent management | `/privacy/cookies` |
| Right to Withdraw Consent (Art. 7) | Cookie preferences | `/privacy/cookies` |

---

## 7. PROCESSING RECORDS SUMMARY

**Total Processing Activities**: 7

**Data Categories Processed**: 
- Identification data (email, name, user ID)
- Account data (settings, preferences, roles)
- Content data (agents, workflows, execution data)
- Behavioral data (execution logs, notification reads)
- Technical data (OAuth tokens, encrypted credentials)

**Legal Bases Used**:
- Consent (Articles 6(1)(a), 7)
- Contract (Article 6(1)(b))
- Legitimate Interests (Article 6(1)(f))

**Automated Decision-Making**: 
- Limited (AI agent execution decisions - user-initiated)

---

**Document Maintained By**: Data Protection Officer / Admin  
**Review Frequency**: Quarterly  
**Last Review Date**: December 2025  
**Next Review Date**: March 2026

