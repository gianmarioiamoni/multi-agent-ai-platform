# Vercel Deployment Checklist

Quick checklist for deploying Multi-Agent AI Platform to Vercel.

## 📋 Pre-Deployment

### Code Preparation
- [ ] Code committed and pushed to Git repository
- [ ] Build passes locally: `npm run build`
- [ ] Linting passes: `npm run lint`
- [ ] No TypeScript errors
- [ ] `vercel.json` exists with cron configuration

### Service Accounts Setup
- [ ] Supabase project created and configured
- [ ] Database migrations applied
- [ ] OpenAI API key obtained
- [ ] Stripe account created (if using payments)
- [ ] Email provider configured (SMTP or API)
- [ ] Upstash Redis created (optional but recommended)
- [ ] Google Cloud OAuth configured (if using Calendar)

---

## 🔧 Vercel Configuration

### Project Setup
- [ ] Vercel account created
- [ ] Project imported from Git repository
- [ ] Framework auto-detected as Next.js

### Environment Variables (Required)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `OPENAI_API_KEY`
- [ ] `NEXT_PUBLIC_APP_URL` (update after first deploy)
- [ ] `ADMIN_EMAIL`
- [ ] `ADMIN_PASSWORD`
- [ ] Email configuration (SMTP or API provider)

### Environment Variables (Optional)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (if using payments)
- [ ] `STRIPE_SECRET_KEY` (if using payments)
- [ ] `STRIPE_WEBHOOK_SECRET` (if using payments)
- [ ] `UPSTASH_REDIS_REST_URL` (recommended)
- [ ] `UPSTASH_REDIS_REST_TOKEN` (recommended)
- [ ] `CSRF_SECRET` (recommended)
- [ ] `CRON_SECRET` (recommended)
- [ ] `TAVILY_API_KEY` (if using web search)
- [ ] `GOOGLE_CLIENT_ID` (if using Calendar)
- [ ] `GOOGLE_CLIENT_SECRET` (if using Calendar)

---

## 🚀 Deployment

### First Deployment
- [ ] Click "Deploy" in Vercel Dashboard
- [ ] Wait for build to complete
- [ ] Check deployment logs for errors
- [ ] Note deployment URL

### Post-Deployment Configuration
- [ ] Update `NEXT_PUBLIC_APP_URL` with actual Vercel URL
- [ ] Create admin user: `npm run bootstrap:admin` (or via Supabase)
- [ ] Test application loads correctly
- [ ] Test user signup/login

---

## 🔗 Webhooks Configuration

### Stripe Webhook
- [ ] Get Vercel deployment URL
- [ ] Create webhook in Stripe Dashboard
- [ ] Webhook URL: `https://your-app.vercel.app/api/stripe/webhook`
- [ ] Select events:
  - [ ] `checkout.session.completed`
  - [ ] `customer.subscription.updated`
  - [ ] `customer.subscription.deleted`
  - [ ] `invoice.payment_succeeded`
  - [ ] `invoice.payment_failed`
- [ ] Copy webhook signing secret
- [ ] Add `STRIPE_WEBHOOK_SECRET` to Vercel environment variables
- [ ] Test webhook (create test subscription)

### Vercel Cron
- [ ] Verify `vercel.json` has cron configuration
- [ ] Check Vercel Dashboard → Cron Jobs
- [ ] Verify cron appears: `/api/cron/subscription-expiry` (daily 2 AM UTC)
- [ ] Wait for first execution or trigger manually

---

## ✅ Post-Deployment Testing

### Core Features
- [ ] User can sign up
- [ ] User can log in
- [ ] Admin can access admin panel (`/admin`)
- [ ] User can create agents
- [ ] User can create workflows
- [ ] AI agents execute correctly
- [ ] Tool calls work (web search, email, etc.)

### Email
- [ ] Contact form sends email
- [ ] Subscription emails work (if using Stripe)
- [ ] Email notifications work

### Payments (if enabled)
- [ ] Stripe checkout page loads
- [ ] Payment processing works
- [ ] Webhook receives events
- [ ] Subscription updates in database

### Security
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Security headers present (check DevTools)
- [ ] Rate limiting works (if Upstash configured)
- [ ] CSRF protection works

---

## 🔄 Custom Domain (Optional)

- [ ] Domain added in Vercel Dashboard
- [ ] DNS records configured
- [ ] SSL certificate active (automatic)
- [ ] `NEXT_PUBLIC_APP_URL` updated to custom domain
- [ ] Stripe webhook URL updated
- [ ] Google OAuth redirect URI updated

---

## 📊 Monitoring Setup

- [ ] Vercel Analytics enabled (optional)
- [ ] Error tracking configured
- [ ] API usage monitoring (OpenAI, Stripe)
- [ ] Supabase logs accessible
- [ ] Alerts configured for errors

---

## 🐛 Troubleshooting

If issues occur, check:
- [ ] Vercel deployment logs
- [ ] Browser console for client errors
- [ ] Supabase logs
- [ ] Stripe webhook events
- [ ] Environment variables are correct
- [ ] All services are active

---

## 📝 Notes

- **First deployment URL**: `https://your-project.vercel.app`
- **Admin user**: Create via `npm run bootstrap:admin` or Supabase Dashboard
- **Webhook secret**: Get from Stripe Dashboard → Webhooks → Endpoint details
- **Cron schedule**: Daily at 2 AM UTC (configured in `vercel.json`)

---

## 🆘 Support

If you need help:
1. Check deployment logs in Vercel Dashboard
2. Review error messages
3. Verify all environment variables
4. Contact: gianmarioiamoni1@gmail.com

