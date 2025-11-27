# Setup Google OAuth - Complete Guide

## ✅ Code Already Implemented

The application already has Google OAuth fully implemented:
- ✅ "Continue with Google" button in login page
- ✅ OAuth flow handled by Supabase
- ✅ Callback route for OAuth redirect
- ✅ Profile auto-creation on first login
- ✅ Error handling and loading states

**You just need to configure the credentials!**

---

## 🔧 Step 1: Google Cloud Console Setup

### 1.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Project name: `Multi-Agent AI Platform`
4. Click **"Create"**
5. Wait for project creation (~30 seconds)
6. Select the new project from dropdown

### 1.2 Enable Google+ API

1. In left menu, go to: **APIs & Services** → **Library**
2. Search for: `Google+ API`
3. Click on it
4. Click **"Enable"**

### 1.3 Configure OAuth Consent Screen

1. Go to: **APIs & Services** → **OAuth consent screen**
2. Choose: **External** (unless you have Google Workspace)
3. Click **"Create"**

**App Information**:
- **App name**: `Multi-Agent AI Platform`
- **User support email**: Your email
- **App logo**: (optional, can skip)
- **Application home page**: `http://localhost:3000` (for dev)
- **Application privacy policy**: (optional for dev)
- **Application terms of service**: (optional for dev)
- **Authorized domains**: Leave empty for localhost

**Developer contact information**:
- Your email address

4. Click **"Save and Continue"**

**Scopes**:
- Click **"Add or Remove Scopes"**
- Select:
  - `email`
  - `profile`
  - `openid`
- Click **"Update"**
- Click **"Save and Continue"**

**Test users** (only needed in "Testing" mode):
- Click **"Add Users"**
- Add your email for testing
- Click **"Save and Continue"**

5. Click **"Back to Dashboard"**

### 1.4 Create OAuth 2.0 Credentials

1. Go to: **APIs & Services** → **Credentials**
2. Click **"Create Credentials"** → **"OAuth client ID"**

**Application type**: `Web application`

**Name**: `Multi-Agent AI Platform - Web`

**Authorized JavaScript origins**:
```
http://localhost:3000
http://localhost:3001
http://localhost:3002
```
(Add your production URL when deploying)

**Authorized redirect URIs**:
```
https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback
http://localhost:3000/auth/callback
```

⚠️ **Important**: Replace `YOUR_SUPABASE_PROJECT_REF` with your actual Supabase project reference!

To find it:
- Go to Supabase Dashboard
- Your URL is: `https://xxxxx.supabase.co`
- Use: `https://xxxxx.supabase.co/auth/v1/callback`

3. Click **"Create"**

### 1.5 Copy Credentials

You'll see a popup with:
- **Client ID**: Something like `123456789-abcdef.apps.googleusercontent.com`
- **Client Secret**: Something like `GOCSPX-abc123def456`

**Copy both and keep them safe!** 🔐

---

## 🗄️ Step 2: Supabase Configuration

### 2.1 Enable Google Provider

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `multi-agent-ai-platform`
3. In left menu: **Authentication** → **Providers**
4. Find **Google** in the list
5. Toggle **"Enable"** ON ✅

### 2.2 Configure Google Provider

**Client ID** (paste from Google Cloud):
```
123456789-abcdef.apps.googleusercontent.com
```

**Client Secret** (paste from Google Cloud):
```
GOCSPX-abc123def456
```

**Authorized Client IDs**: Leave empty

**Skip nonce check**: Leave unchecked

6. Click **"Save"**

### 2.3 Verify Redirect URL

1. Stay in **Authentication** → **Providers**
2. At the top, you'll see: **"Callback URL (for OAuth)"**
3. It should be: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
4. **This is the URL you added to Google Cloud!**

If you missed it, go back to Google Cloud and add it now.

---

## 🔧 Step 3: Update Environment Variables

Update your `.env.local`:

```env
# Google OAuth (add these if not present)
GOOGLE_CLIENT_ID=your-client-id-from-google-cloud.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret-from-google-cloud
```

⚠️ **Note**: These env vars are not strictly needed in the app code (Supabase handles it), but good to keep for reference.

---

## 🧪 Step 4: Test Google OAuth

### 4.1 Basic Test

1. Go to: http://localhost:3000/auth/login
2. Click **"Continue with Google"** button
3. You should be redirected to Google login
4. Select your Google account
5. Grant permissions (email, profile)
6. You'll be redirected back to the app
7. Callback URL: `http://localhost:3000/auth/callback`
8. Then redirected to: `http://localhost:3000/app/dashboard` ✅

### 4.2 Verify in Supabase

1. Go to **Authentication** → **Users**
2. You should see your new user
3. **Provider**: `google`
4. **Email**: Your Google email
5. **Email Confirmed**: Yes ✅

### 4.3 Verify Profile Created

1. Go to **Table Editor** → **profiles**
2. You should see a new profile record
3. **name**: From your Google account
4. **role**: `user`
5. **user_id**: Matches the auth.users id

---

## 🐛 Troubleshooting

### Error: "Invalid redirect_uri"

**Problem**: The callback URL in Google Cloud doesn't match Supabase

**Solution**:
1. Go to Google Cloud Console → Credentials
2. Edit your OAuth client
3. Add the exact URL from Supabase:
   ```
   https://YOUR_PROJECT.supabase.co/auth/v1/callback
   ```
4. Make sure there are no typos!

### Error: "Access blocked: This app's request is invalid"

**Problem**: Scopes not configured in OAuth consent screen

**Solution**:
1. Go to OAuth consent screen in Google Cloud
2. Add scopes: `email`, `profile`, `openid`
3. Save and try again

### Error: "This app hasn't been verified"

**Problem**: App is in "Testing" mode

**Solution** (for development):
1. Click "Advanced"
2. Click "Go to Multi-Agent AI Platform (unsafe)"
3. This is OK for development/testing

**Solution** (for production):
1. Go to OAuth consent screen
2. Click "Publish App"
3. Submit for verification (takes time)

### Error: "User not allowed to sign in"

**Problem**: User not in test users list (while app in Testing mode)

**Solution**:
1. Go to OAuth consent screen → Test users
2. Add the Google account email
3. Save and try again

### Button Shows "Connecting to Google..." But Nothing Happens

**Problem**: JavaScript error or popup blocked

**Solution**:
1. Check browser console for errors
2. Allow popups for localhost in browser settings
3. Try in incognito mode
4. Check if NEXT_PUBLIC_APP_URL is correct in `.env.local`

### User Redirected to Login After OAuth Success

**Problem**: Session not being created or RLS policies issue

**Solution**:
1. Check terminal logs for errors
2. Verify migration `002_fix_rls_policies.sql` was run
3. Check Supabase logs for auth errors

---

## 🎯 Success Criteria

Google OAuth is working when:

- [x] Button "Continue with Google" is visible
- [x] Click redirects to Google login page
- [x] After Google authentication, returns to app
- [x] User is created in Supabase auth.users
- [x] Profile is created in profiles table
- [x] User sees dashboard with their Google name
- [x] Can logout and login again with Google
- [x] No errors in browser console
- [x] No errors in terminal logs

---

## 🎨 UI Features Already Implemented

### Google Button Styling
- ✅ Google logo (colored SVG)
- ✅ Loading state: "Connecting to Google..."
- ✅ Disabled state while loading
- ✅ Error toast if OAuth fails
- ✅ Smooth UX with proper feedback

### Login Flow
```
1. User clicks "Continue with Google"
2. Button shows loading spinner
3. Redirects to Google
4. User authenticates with Google
5. Google redirects to: /auth/callback
6. Callback processes session
7. Redirects to: /app/dashboard
8. User sees welcome message with Google name! 🎉
```

---

## 🚀 Production Deployment

When deploying to production:

### Update Google Cloud:

1. Add production URLs to **Authorized JavaScript origins**:
   ```
   https://yourdomain.com
   ```

2. Add production callback to **Authorized redirect URIs**:
   ```
   https://YOUR_PROJECT.supabase.co/auth/v1/callback
   ```

### Update Supabase:

1. Go to **Authentication** → **URL Configuration**
2. Update **Site URL**: `https://yourdomain.com`
3. Add to **Redirect URLs**: `https://yourdomain.com/**`

### Publish App:

1. Go to Google Cloud → OAuth consent screen
2. Click **"Publish App"**
3. Submit for verification (optional but recommended)

---

## 📋 Quick Checklist

Before testing, make sure:

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] OAuth client credentials created
- [ ] Client ID and Secret copied
- [ ] Supabase Google provider enabled
- [ ] Client ID and Secret pasted in Supabase
- [ ] Redirect URI matches exactly
- [ ] Test user added (if app in Testing mode)
- [ ] Browser allows popups for localhost
- [ ] Dev server running (`pnpm dev`)

---

## 🎉 That's It!

Once configured, Google OAuth will work seamlessly with:
- ✅ Email/password authentication
- ✅ Profile auto-creation
- ✅ Role assignment (default: user)
- ✅ Dashboard access
- ✅ Logout functionality

**No additional code needed - everything is already implemented!** 🚀

