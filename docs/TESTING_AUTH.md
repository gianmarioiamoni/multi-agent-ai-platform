# Testing Authentication - Quick Guide

## 🚀 Server Status

The development server should be running on:
- **Local**: http://localhost:3000
- **Network**: Check terminal for network address

If not running: `pnpm dev`

## 📋 Test Checklist

### 1. ✅ Initial Redirect Test
**URL**: http://localhost:3000

**Expected behavior**:
- Should automatically redirect to `/auth/login`
- Shows login page with vibrant theme (Electric Indigo primary color)

**What to check**:
- [ ] Page loads without errors
- [ ] See "Multi-Agent AI Platform" title
- [ ] See "Sign in to your account" card
- [ ] Google OAuth button visible
- [ ] Email/password form visible
- [ ] "Don't have an account? Sign up" link visible

---

### 2. ✅ Sign Up Flow Test

**URL**: http://localhost:3000/auth/signup (or click "Sign up" link)

**Test Steps**:

#### Test A: Form Validation
1. Click "Create account" without filling anything
   - [ ] Should show "Email is required" error
   - [ ] Should show "Password is required" error

2. Enter invalid email: `test`
   - [ ] Should show "Please enter a valid email address"

3. Enter weak password: `123`
   - [ ] Should show password strength error
   - [ ] Error message mentions uppercase, lowercase, number requirements

4. Enter mismatched passwords:
   - Password: `Test123456`
   - Confirm: `Test654321`
   - [ ] Should show "Passwords do not match" error

#### Test B: Successful Registration
1. Fill form correctly:
   - **Name**: Test User
   - **Email**: test@example.com
   - **Password**: Test123456!
   - **Confirm Password**: Test123456!

2. Click "Create account"
   - [ ] Button shows loading state: "Creating account..."
   - [ ] Success toast appears: "Account created!"
   - [ ] Toast message: "Please check your email to verify your account."
   - [ ] After 2 seconds, redirects to `/auth/login`

**Note**: In development mode, Supabase might not send verification emails. Check your Supabase dashboard → Authentication → Users to see if the user was created.

---

### 3. ✅ Sign In Flow Test

**URL**: http://localhost:3000/auth/login

#### Test A: Form Validation
1. Click "Sign in" without filling anything
   - [ ] Should show validation errors

#### Test B: Invalid Credentials
1. Enter:
   - **Email**: wrong@example.com
   - **Password**: WrongPassword123!

2. Click "Sign in"
   - [ ] Error toast appears
   - [ ] Shows appropriate error message from Supabase

#### Test C: Successful Sign In
1. Enter the credentials you used in signup:
   - **Email**: test@example.com
   - **Password**: Test123456!

2. Click "Sign in"
   - [ ] Button shows: "Signing in..."
   - [ ] On success, redirects to `/app/dashboard`
   - [ ] Dashboard shows welcome message: "Welcome back, Test User!"
   - [ ] Dashboard shows placeholder cards (Agents, Workflows, Runs)

---

### 4. ✅ Google OAuth Test (Optional)

**Prerequisites**: 
- Google OAuth configured in Supabase
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`

**Test Steps**:
1. On login page, click "Continue with Google"
   - [ ] Button shows: "Connecting to Google..."
   - [ ] Redirects to Google login page
   - [ ] After Google authentication, returns to app
   - [ ] Callback URL: http://localhost:3000/auth/callback
   - [ ] Finally redirects to `/app/dashboard`

**If OAuth not configured**:
- Error toast will show
- This is expected if you haven't set up Google OAuth yet

---

### 5. ✅ Protected Route Test

**Test**: Try accessing dashboard without authentication

1. Sign out (or open incognito window)
2. Try to access: http://localhost:3000/app/dashboard
   - [ ] Should redirect to `/auth/login`
   - [ ] Cannot access dashboard without authentication

---

### 6. ✅ Session Persistence Test

1. Sign in successfully
2. Go to dashboard: http://localhost:3000/app/dashboard
3. Refresh the page (F5 or Cmd+R)
   - [ ] Should stay on dashboard (not redirect to login)
   - [ ] User data persists (name, welcome message)

4. Close browser tab
5. Reopen http://localhost:3000
   - [ ] Should redirect to dashboard (still authenticated)

---

### 7. ✅ Dark Mode Test

**Test Steps**:
1. Check your system dark mode setting:
   - **macOS**: System Settings → Appearance → Dark
   - **Windows**: Settings → Personalization → Colors → Dark

2. The app should automatically switch themes
   - [ ] Light mode: White background, dark text
   - [ ] Dark mode: Dark purple/blue background, light text
   - [ ] Colors are more vibrant in dark mode
   - [ ] Primary button color changes appropriately

---

### 8. ✅ Responsive Design Test

**Test on different screen sizes**:

1. **Mobile** (< 768px):
   - [ ] Forms are full width
   - [ ] Typography scales down
   - [ ] Buttons are touch-friendly
   - [ ] Toast notifications fit screen

2. **Tablet** (768px - 1024px):
   - [ ] Card width is constrained
   - [ ] Layout is centered

3. **Desktop** (> 1024px):
   - [ ] Maximum card width enforced
   - [ ] Typography uses larger sizes
   - [ ] Proper spacing

---

## 🐛 Common Issues & Solutions

### Issue: "Failed to connect to Supabase"
**Solution**: 
- Check `.env.local` has correct Supabase credentials
- Verify Supabase project is running
- Run: `pnpm verify:supabase`

### Issue: "Table 'profiles' does not exist"
**Solution**:
- Run the migration in Supabase SQL Editor
- File: `supabase/migrations/001_initial_schema.sql`

### Issue: "Google OAuth not working"
**Solution**:
- This is expected if not configured yet
- See `SUPABASE_SETUP.md` for Google OAuth setup instructions
- Can test with email/password for now

### Issue: Toast notifications not showing
**Solution**:
- Check browser console for errors
- Verify ToastProvider is in layout.tsx
- Toast should auto-dismiss after 5 seconds

### Issue: Dark mode not switching
**Solution**:
- Using system preference (prefers-color-scheme)
- Toggle system dark mode to test
- Future: Can add manual toggle

---

## 📊 What to Verify in Supabase Dashboard

After testing, check your Supabase dashboard:

1. **Authentication → Users**:
   - [ ] See your test user (test@example.com)
   - [ ] Email confirmed status
   - [ ] Last sign in timestamp

2. **Table Editor → profiles**:
   - [ ] Profile record created for your user
   - [ ] `role` field = 'user'
   - [ ] `name` field = 'Test User'
   - [ ] Timestamps populated

3. **Logs** (optional):
   - Check for any errors during auth flow

---

## ✅ Success Criteria

Authentication is working if:
- [x] Can create new account (signup)
- [x] Receives appropriate validation errors
- [x] Can sign in with email/password
- [x] Redirects to dashboard after login
- [x] Dashboard shows user data
- [x] Cannot access protected routes when logged out
- [x] Session persists across page refreshes
- [x] Toast notifications work
- [x] Dark/light mode works
- [x] Responsive on all screen sizes

---

## 🎨 Visual Features to Notice

### Vibrant Theme
- **Electric Indigo** primary buttons
- **Vibrant Cyan** accents
- **Hot Pink** error states (instead of standard red)
- **Lime Green** success messages
- **Warm Orange** warnings

### Smooth Interactions
- Button hover effects
- Loading states with spinners
- Smooth page transitions
- Toast slide-in animations
- Form focus states with ring effect

### Typography
- Clean, modern font (Inter)
- Proper heading hierarchy
- Readable body text
- Accessible font sizes

---

## 🚀 Next Steps After Testing

Once authentication is working:
1. Test with real email (if verification enabled)
2. Create multiple users to test different scenarios
3. Proceed with:
   - Layout base (Navbar, Sidebar)
   - Middleware for route protection
   - Admin bootstrap script
   - Admin panel UI

---

**Happy Testing! 🎉**

If you encounter any issues, check:
1. Browser console for errors
2. Terminal for server errors
3. Supabase dashboard for auth logs

