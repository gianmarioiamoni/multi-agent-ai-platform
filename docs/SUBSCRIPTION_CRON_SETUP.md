# Subscription Cron Job Setup

## Overview
The subscription expiry cron job processes subscription expirations daily, handling:
- Notifications (2 days before expiry, at expiry, when disabled)
- Plan transitions (switching to scheduled plan)
- User disabling (when subscription expires)
- Returning to trial (after cancellation with trial days remaining)

## Vercel Cron Configuration

The cron job is configured in `vercel.json`:
- **Schedule**: Daily at 2:00 AM UTC (`0 2 * * *`)
- **Endpoint**: `/api/cron/subscription-expiry`

## Environment Variables

Add to `.env.local`:
```bash
# Optional: Cron secret for additional security
CRON_SECRET=your-secret-key-here
```

If `CRON_SECRET` is set, the cron job will verify the `Authorization: Bearer <CRON_SECRET>` header.

## Manual Execution

You can manually trigger the cron job:

```bash
# Using curl
curl -X GET http://localhost:3000/api/cron/subscription-expiry

# With secret (if configured)
curl -X GET \
  -H "Authorization: Bearer your-secret-key-here" \
  http://localhost:3000/api/cron/subscription-expiry
```

## Testing

To test the cron job locally:

1. **Set up test data**:
   - Create users with subscriptions expiring soon
   - Manually set `subscription_expires_at` to test dates

2. **Run manually**:
   ```bash
   curl http://localhost:3000/api/cron/subscription-expiry
   ```

3. **Check logs**:
   - View logs in Supabase Dashboard → Logs
   - Check email delivery (SMTP logs)
   - Verify user status changes

## Alternative: External Cron Service

If not using Vercel Cron, you can use external services:

### EasyCron / Cron-job.org
1. Create a new cron job
2. Set schedule: Daily at 2:00 AM UTC
3. URL: `https://your-domain.com/api/cron/subscription-expiry`
4. Method: GET
5. Headers (optional): `Authorization: Bearer <CRON_SECRET>`

### GitHub Actions
Create `.github/workflows/subscription-expiry.yml`:
```yaml
name: Subscription Expiry
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
  workflow_dispatch:

jobs:
  process-expiries:
    runs-on: ubuntu-latest
    steps:
      - name: Call cron endpoint
        run: |
          curl -X GET \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://your-domain.com/api/cron/subscription-expiry
```

## What the Cron Job Does

1. **Fetches profiles** with subscriptions expiring in the next 3 days
2. **For each profile**:
   - Checks if plan switch is due → switches plan
   - Checks if subscription expired → sends notification, disables user
   - Checks if expiring in 2 days → sends warning
3. **Tracks notifications** to avoid duplicates
4. **Returns statistics** about processed/disabled/notified users

## Monitoring

Check cron job execution:
- Vercel Dashboard → Cron Jobs → View logs
- Supabase Logs → Search for "SubscriptionExpiryManager"
- Email delivery logs (SMTP provider)

## Troubleshooting

**Cron job not running:**
- Verify `vercel.json` is deployed
- Check Vercel Cron Jobs dashboard
- Verify endpoint is accessible

**Notifications not sent:**
- Check email configuration (SMTP settings)
- Verify `getEmailToolConfig()` returns valid config
- Check Supabase logs for errors

**Users not disabled:**
- Verify subscription_expires_at is in the past
- Check for next_plan (user might be switching)
- Check logs for errors

