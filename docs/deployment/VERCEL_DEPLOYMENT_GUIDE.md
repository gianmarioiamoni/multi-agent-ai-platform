# Vercel Deployment Guide

Complete guide for deploying Multi-Agent AI Platform to Vercel.

## 📋 Prerequisites

- Vercel account (sign up at [vercel.com](https://vercel.com))
- GitHub/GitLab/Bitbucket repository with your code
- All service accounts configured (Supabase, OpenAI, Stripe, etc.)

## 🚀 Step 1: Prepare Repository

### 1.1 Ensure Build Works Locally

```bash
# Test build locally
npm run build

# Verify no errors
npm run lint
```

### 1.2 Commit All Changes

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

## 🔧 Step 2: Connect GitHub to Vercel

### 2.1 Connect GitHub Account

**If you signed up with email:**

1. Go to Vercel Dashboard → **Settings** → **Git**
2. Click **"Connect GitHub"** or **"Add Git Provider"**
3. Authorize Vercel to access your GitHub account
4. Grant permissions:
   - ✅ **Read access to repositories** (required)
   - ✅ **Write access to repository hooks** (for automatic deployments)
5. Choose repository access:
   - **All repositories** (recommended for first setup)
   - **Only select repositories** (more secure)

**If repository doesn't appear:**

- Check GitHub → Settings → Applications → Authorized OAuth Apps → Vercel
- Ensure repository is selected in permissions
- If repo is in organization, ensure org has granted Vercel access
- See `VERCEL_GITHUB_CONNECTION.md` for detailed troubleshooting

## 🔧 Step 3: Create Vercel Project

### 3.1 Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. You should now see your GitHub repositories
4. Search for `multi-agent-ai-platform` or your repository name
5. Click **"Import"** next to your repository
6. Vercel will auto-detect Next.js

### 3.2 Configure Project Settings

- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

## 🔐 Step 4: Configure Environment Variables

Add all required environment variables in Vercel Dashboard:

**Settings** → **Environment Variables**

### 4.1 Supabase (Required)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Where to find:**
- Supabase Dashboard → Project Settings → API
- `NEXT_PUBLIC_SUPABASE_URL`: Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `anon` `public` key
- `SUPABASE_SERVICE_ROLE_KEY`: `service_role` `secret` key (⚠️ Keep secret!)

### 4.2 OpenAI (Required)

```env
OPENAI_API_KEY=sk-...
```

**Where to find:**
- [OpenAI Platform](https://platform.openai.com/api-keys)
- Create new API key if needed

### 4.3 App Configuration (Required)

```env
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

**⚠️ IMPORTANT:** 
- **MUST include `https://` protocol**
- **DO NOT** use just the domain (e.g., `your-domain.vercel.app`)
- **MUST** use full URL (e.g., `https://your-domain.vercel.app`)

**Examples:**
- ✅ Correct: `https://multi-agent-ai-platform.vercel.app`
- ❌ Wrong: `multi-agent-ai-platform.vercel.app` (will cause build errors)

**Note:** Update this after first deployment with your actual Vercel URL, or use custom domain.

### 4.4 Admin User (Required)

```env
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-password
```

**Note:** Run `npm run bootstrap:admin` after deployment to create admin user.

### 4.5 Stripe (Required for Payments)

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Where to find:**
- [Stripe Dashboard](https://dashboard.stripe.com) → Developers → API keys
- **Webhook Secret**: Create webhook endpoint first (see Step 5)

### 4.6 Email Configuration (Required)

Choose one option:

#### Option A: SMTP (Gmail/Generic)

```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
```

**Gmail App Password:**
- Google Account → Security → 2-Step Verification → App passwords
- Generate password for "Mail"

#### Option B: API Provider (Resend/SendGrid/Mailgun)

```env
EMAIL_PROVIDER=resend
EMAIL_API_KEY=re_...
EMAIL_FROM=noreply@yourdomain.com
```

### 4.7 Rate Limiting (Optional but Recommended)

```env
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

**Where to find:**
- [Upstash Dashboard](https://console.upstash.com)
- Create Redis database → Copy REST URL and Token

### 4.8 Web Search (Optional)

```env
TAVILY_API_KEY=tvly-...
```

**Where to find:**
- [Tavily API](https://tavily.com) → Get API Key

### 4.9 Security (Optional but Recommended)

```env
CSRF_SECRET=your-random-secret-string
CRON_SECRET=your-random-secret-string
```

**Generate secrets:**
```bash
# Generate random secrets
openssl rand -hex 32
```

### 4.10 Google Calendar (Optional)

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Where to find:**
- [Google Cloud Console](https://console.cloud.google.com)
- APIs & Services → Credentials → OAuth 2.0 Client ID

## 📝 Step 5: Configure vercel.json

Ensure `vercel.json` exists in project root:

```json
{
  "crons": [
    {
      "path": "/api/cron/subscription-expiry",
      "schedule": "0 2 * * *"
    }
  ]
}
```

**Cron Schedule:**
- Runs daily at 2 AM UTC
- Processes subscription expiries
- Sends notifications
- Disables expired accounts

## 🔗 Step 6: Configure Webhooks

### 6.1 Stripe Webhook

1. **Get Vercel Deployment URL:**
   - After first deployment, copy your Vercel URL
   - Example: `https://your-app.vercel.app`

2. **Create Stripe Webhook:**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
   - Click **"Add endpoint"**
   - **Endpoint URL**: `https://your-app.vercel.app/api/stripe/webhook`
   - **Events to send**: Select these events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
   - Click **"Add endpoint"**

3. **Get Webhook Secret:**
   - Click on the webhook endpoint
   - Copy **"Signing secret"** (starts with `whsec_`)
   - Add to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

### 6.2 Vercel Cron Job

The cron job is automatically configured via `vercel.json`. No additional setup needed.

**Verify it's working:**
- Vercel Dashboard → Your Project → Settings → Cron Jobs
- Should show: `/api/cron/subscription-expiry` scheduled daily at 2 AM UTC

## 🚀 Step 7: Deploy

### 7.1 First Deployment

1. Click **"Deploy"** in Vercel Dashboard
2. Wait for build to complete
3. Check deployment logs for errors

### 7.2 Verify Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Check if app loads correctly
3. Test authentication (signup/login)

### 7.3 Create Admin User

After first deployment, create admin user:

**Option A: Via Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run bootstrap script (requires env vars)
vercel env pull .env.local
npm run bootstrap:admin
```

**Option B: Via Supabase Dashboard**

1. Go to Supabase Dashboard → Authentication → Users
2. Create new user with admin email
3. Go to SQL Editor and run:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@yourdomain.com');
```

## ✅ Step 8: Post-Deployment Checklist

### 8.1 Verify Environment Variables

- [ ] All Supabase variables set
- [ ] OpenAI API key set
- [ ] Stripe keys set (if using payments)
- [ ] Email configuration set
- [ ] `NEXT_PUBLIC_APP_URL` matches your Vercel domain
- [ ] Admin credentials set

### 8.2 Test Core Features

- [ ] User signup/login works
- [ ] Admin can access admin panel
- [ ] Agents can be created
- [ ] Workflows can be created
- [ ] AI agents execute correctly
- [ ] Email sending works (test with contact form)
- [ ] Stripe checkout works (if enabled)

### 8.3 Verify Webhooks

- [ ] Stripe webhook receives events (check Stripe Dashboard → Webhooks → Recent events)
- [ ] Cron job runs (check Vercel Dashboard → Cron Jobs → Execution history)

### 8.4 Security Checks

- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Security headers working (check browser DevTools → Network → Response Headers)
- [ ] Rate limiting active (if Upstash configured)
- [ ] CSRF protection working

## 🔄 Step 9: Custom Domain (Optional)

### 9.1 Add Domain in Vercel

1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `yourdomain.com`)
3. Follow DNS configuration instructions

### 9.2 Update Environment Variables

Update `NEXT_PUBLIC_APP_URL` to your custom domain:

```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 9.3 Update Stripe Webhook

1. Go to Stripe Dashboard → Webhooks
2. Edit webhook endpoint
3. Update URL to: `https://yourdomain.com/api/stripe/webhook`
4. Copy new webhook secret and update `STRIPE_WEBHOOK_SECRET` in Vercel

## 🐛 Troubleshooting

### Build Fails

**Error: Missing environment variables**
- Check all required variables are set in Vercel Dashboard
- Ensure no typos in variable names

**Error: TypeScript errors**
- Run `npm run build` locally first
- Fix all TypeScript errors before deploying

### Runtime Errors

**Error: "Supabase connection failed"**
- Verify `NEXT_PUBLIC_SUPABASE_URL` and keys are correct
- Check Supabase project is active

**Error: "OpenAI API error"**
- Verify `OPENAI_API_KEY` is valid
- Check API key has sufficient credits

**Error: "Stripe webhook signature invalid"**
- Verify `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
- Ensure webhook URL is correct

### Cron Job Not Running

- Check `vercel.json` is committed to repository
- Verify cron schedule syntax: `"0 2 * * *"` (daily at 2 AM UTC)
- Check Vercel Dashboard → Cron Jobs for execution history

### Email Not Sending

- Verify SMTP credentials or API key
- Check email provider allows sending from your domain
- Test with contact form

## 📊 Monitoring

### Vercel Analytics

- Vercel Dashboard → Analytics
- Monitor performance, errors, and usage

### Supabase Logs

- Supabase Dashboard → Logs
- Monitor database queries and errors

### Application Logs

- Check Vercel function logs for API routes
- Use structured logging system in app

## 🔄 Continuous Deployment

Vercel automatically deploys on:
- Push to main/master branch (production)
- Push to other branches (preview deployments)

**Recommended workflow:**
1. Develop on feature branches
2. Create pull requests (preview deployments)
3. Merge to main (production deployment)

## 🔒 Security Best Practices

1. **Never commit secrets** to Git
2. **Use Vercel Environment Variables** for all secrets
3. **Enable Vercel Protection** (password protection for preview deployments)
4. **Monitor API usage** (OpenAI, Stripe, etc.)
5. **Set up alerts** for errors and high usage
6. **Regular security audits** of dependencies

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)

## 🆘 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for client errors
3. Review Supabase logs
4. Contact: gianmarioiamoni1@gmail.com

