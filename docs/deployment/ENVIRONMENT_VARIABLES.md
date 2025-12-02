# Environment Variables Reference

Complete list of all environment variables required for Multi-Agent AI Platform deployment.

## 🔴 Required Variables

### Supabase (Required)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Description:**
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public anonymous key (safe for client-side)
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (⚠️ server-side only, bypasses RLS)

**Where to find:** Supabase Dashboard → Project Settings → API

---

### OpenAI (Required)

```env
OPENAI_API_KEY=sk-...
```

**Description:** OpenAI API key for LLM orchestration and agent execution

**Where to find:** [OpenAI Platform](https://platform.openai.com/api-keys)

---

### App Configuration (Required)

```env
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

**Description:** Base URL of your deployed application (used for redirects, emails, webhooks)

**⚠️ IMPORTANT:** 
- **MUST include protocol** (`https://`)
- **DO NOT** use just the domain (e.g., `your-domain.vercel.app`)
- **MUST** use full URL (e.g., `https://your-domain.vercel.app`)

**Examples:**
- ✅ Correct: `https://multi-agent-ai-platform.vercel.app`
- ✅ Correct: `https://yourdomain.com`
- ❌ Wrong: `multi-agent-ai-platform.vercel.app` (missing protocol)
- ❌ Wrong: `http://yourdomain.com` (use https in production)

**Note:** Update after deployment with actual Vercel URL or custom domain

---

### Admin User (Required)

```env
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-password
```

**Description:** Credentials for creating admin user (used by bootstrap script)

**Note:** Run `npm run bootstrap:admin` after deployment

---

## 🟡 Payment & Subscription (Required if using Stripe)

### Stripe

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Description:**
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Public Stripe key (client-side)
- `STRIPE_SECRET_KEY`: Secret Stripe key (server-side)
- `STRIPE_WEBHOOK_SECRET`: Webhook signing secret (from Stripe Dashboard)

**Where to find:** [Stripe Dashboard](https://dashboard.stripe.com) → Developers → API keys

**Webhook Setup:**
1. Create webhook endpoint in Stripe: `https://your-domain.vercel.app/api/stripe/webhook`
2. Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
3. Copy signing secret from webhook details

---

## 🟢 Email Configuration (Required)

Choose **ONE** of the following options:

### Option A: SMTP (Gmail/Generic)

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
```

**Gmail Setup:**
1. Enable 2-Step Verification
2. Generate App Password: Google Account → Security → App passwords
3. Use generated password (16 characters)

**Generic SMTP:**
- Update `SMTP_HOST`, `SMTP_PORT` for your provider
- Use appropriate credentials

### Option B: API Provider (Resend/SendGrid/Mailgun)

```env
EMAIL_PROVIDER=resend
EMAIL_API_KEY=re_...
EMAIL_FROM=noreply@yourdomain.com
```

**Supported Providers:**
- `resend` - Resend API
- `sendgrid` - SendGrid API
- `mailgun` - Mailgun API

**Where to find:**
- Resend: [resend.com](https://resend.com) → API Keys
- SendGrid: [sendgrid.com](https://sendgrid.com) → Settings → API Keys
- Mailgun: [mailgun.com](https://mailgun.com) → Settings → API Keys

---

## 🔵 Optional but Recommended

### Rate Limiting (Upstash Redis)

```env
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

**Description:** Redis connection for distributed rate limiting

**Where to find:** [Upstash Dashboard](https://console.upstash.com) → Create Redis Database

**Benefits:**
- Prevents API abuse
- Distributed rate limiting across Vercel functions
- Better security

---

### Security Secrets

```env
CSRF_SECRET=your-random-secret-string
CRON_SECRET=your-random-secret-string
```

**Description:**
- `CSRF_SECRET`: Secret for CSRF token signing (fallback: uses `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- `CRON_SECRET`: Secret for protecting cron job endpoint

**Generate:**
```bash
openssl rand -hex 32
```

**Note:** If not set, CSRF uses Supabase anon key as fallback (less secure)

---

### Web Search (Tavily)

```env
TAVILY_API_KEY=tvly-...
```

**Description:** API key for Tavily web search tool

**Where to find:** [Tavily API](https://tavily.com) → Get API Key

**Note:** Required only if using web search tool in agents

---

### Google Calendar Integration

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-domain.vercel.app/auth/callback/google-calendar
```

**Description:** OAuth credentials for Google Calendar integration

**Where to find:** [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials

**Setup:**
1. Create OAuth 2.0 Client ID
2. Add authorized redirect URI: `https://your-domain.vercel.app/auth/callback/google-calendar`
3. Enable Google Calendar API

**Note:** `GOOGLE_REDIRECT_URI` is optional (auto-generated from `NEXT_PUBLIC_APP_URL`)

---

## 📋 Quick Setup Checklist

### Minimum Required (App will run but limited features)

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `OPENAI_API_KEY`
- [ ] `NEXT_PUBLIC_APP_URL`
- [ ] `ADMIN_EMAIL`
- [ ] `ADMIN_PASSWORD`
- [ ] Email configuration (SMTP or API provider)

### Full Features (All functionality enabled)

- [ ] All minimum required
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `UPSTASH_REDIS_REST_URL`
- [ ] `UPSTASH_REDIS_REST_TOKEN`
- [ ] `CSRF_SECRET`
- [ ] `CRON_SECRET`
- [ ] `TAVILY_API_KEY` (if using web search)
- [ ] `GOOGLE_CLIENT_ID` (if using calendar)
- [ ] `GOOGLE_CLIENT_SECRET` (if using calendar)

---

## 🔒 Security Notes

1. **Never commit** `.env.local` or `.env` files to Git
2. **Use Vercel Environment Variables** for all secrets
3. **Rotate secrets regularly** (especially API keys)
4. **Use different keys** for development and production
5. **Monitor API usage** to detect unauthorized access

---

## 🧪 Testing Environment Variables

After setting up, verify configuration:

```bash
# Verify Supabase connection
npm run verify:supabase

# Check email configuration
npm run check:email

# Test OpenAI connection (create test script)
# Test Stripe webhook (use Stripe CLI)
```

---

## 📝 Environment Variable Naming Convention

- `NEXT_PUBLIC_*`: Exposed to client-side (safe for browser)
- No prefix: Server-side only (never exposed to client)
- Use descriptive names with service prefix (e.g., `STRIPE_*`, `SMTP_*`)

---

## 🔄 Updating Variables

### In Vercel:

1. Go to Project → Settings → Environment Variables
2. Add/Edit variable
3. Select environments (Production, Preview, Development)
4. Redeploy for changes to take effect

### After Updating:

- **Stripe Webhook Secret**: Update webhook URL in Stripe Dashboard
- **NEXT_PUBLIC_APP_URL**: Update redirect URIs in OAuth providers
- **Email Configuration**: Test email sending

---

## 🆘 Troubleshooting

### "Environment variable not found"

- Check variable name (case-sensitive)
- Verify variable is set in correct environment (Production/Preview)
- Redeploy after adding variables

### "Invalid API key"

- Verify key is correct (no extra spaces)
- Check key hasn't expired
- Verify key has required permissions

### "Webhook signature invalid"

- Ensure `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
- Verify webhook URL is correct
- Check webhook is receiving events in Stripe Dashboard

