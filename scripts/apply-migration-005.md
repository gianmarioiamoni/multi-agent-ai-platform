# Apply Migration 005: Stored Credentials

This migration creates the `stored_credentials` table for securely storing encrypted OAuth tokens and API keys.

## Quick Start

### Option 1: Supabase Dashboard (Recommended)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor**
4. Click **New Query**
5. Copy the contents of `supabase/migrations/005_stored_credentials.sql`
6. Paste into the editor
7. Click **Run** (or press `Cmd/Ctrl + Enter`)
8. Verify success message

### Option 2: Supabase CLI

```bash
# Apply migration
supabase migration up

# Or apply specific migration
supabase db push
```

## What This Migration Does

- Creates `stored_credentials` table for encrypted OAuth tokens
- Adds indexes for performance
- Sets up RLS policies (users can only access their own credentials)
- Creates trigger for auto-updating `updated_at` timestamp

## Required Environment Variables

After applying the migration, make sure to set:

```bash
# Generate with: openssl rand -base64 32
CREDENTIALS_ENCRYPTION_KEY=your-32-character-encryption-key
```

⚠️ **Important**: Store this key securely! If lost, encrypted credentials cannot be decrypted.

## Verification

After applying the migration:

1. Go to **Table Editor** in Supabase Dashboard
2. You should see `stored_credentials` table
3. Check that RLS is enabled (should show 🔒 icon)

## Next Steps

1. Configure Google Calendar OAuth (see `docs/GOOGLE_CALENDAR_SETUP.md`)
2. Test integration in `/app/integrations`

