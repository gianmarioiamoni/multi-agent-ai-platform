# Fix RLS Infinite Recursion - URGENT

## 🐛 Problem Found

The RLS (Row Level Security) policy for admin access is causing **infinite recursion**:

```
Error: infinite recursion detected in policy for relation "profiles"
```

### Root Cause

The admin policy was querying the `profiles` table inside the `profiles` table policy:

```sql
-- This causes infinite loop! ❌
CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles  -- ← Queries profiles within profiles policy!
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
```

## ✅ Solution

We need to:
1. Drop the recursive policies
2. Create a helper function with `SECURITY DEFINER` to bypass RLS
3. Recreate policies using the helper function

## 🔧 How to Fix (2 minutes)

### Step 1: Go to Supabase Dashboard

1. Open [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: `multi-agent-ai-platform`

### Step 2: Run the Fix Migration

1. Go to **SQL Editor** in the left sidebar
2. Click **"New query"**
3. Open the file: `supabase/migrations/002_fix_rls_policies.sql`
4. **Copy ALL the content**
5. **Paste it** in the SQL Editor
6. Click **"Run"** (or Cmd/Ctrl + Enter)

### Step 3: Verify Success

You should see:
- ✅ "Success. No rows returned"
- No errors in the output

### Step 4: Test Login

1. Go back to http://localhost:3000/auth/login
2. Login with your credentials
3. You should now see the dashboard! 🎉

---

## 📋 What the Fix Does

### 1. Removes Problematic Policies
```sql
DROP POLICY "Admins can read all profiles" ON profiles;
DROP POLICY "Admins can update any profile" ON profiles;
```

### 2. Creates Helper Function
```sql
CREATE FUNCTION public.is_admin() RETURNS BOOLEAN
-- Uses SECURITY DEFINER to bypass RLS
-- No recursion because it runs with elevated privileges
```

### 3. Recreates Policies Correctly
```sql
CREATE POLICY "Admins can read all profiles"
  USING (public.is_admin());  -- ← Uses function, no recursion!
```

---

## 🎯 Why This Works

**SECURITY DEFINER** makes the function run with the privileges of the function owner (postgres superuser), which:
- ✅ Bypasses RLS policies
- ✅ No recursion
- ✅ Still secure (only checks current user's role)
- ✅ Fast and efficient

---

## 🧪 After Running the Fix

### Expected Behavior:

1. **Login** → Session created ✅
2. **Profile query** → Works without recursion ✅
3. **Dashboard** → Loads correctly ✅
4. **Welcome message** → Shows your name ✅

### Terminal Logs Should Show:

```
getCurrentUserProfile: User found: xxx
All profiles query result: { count: 1, error: null }
Profile query result: { hasData: true, errorCode: null }
Dashboard - Profile from getCurrentUserProfile: Gianma Tiscali user
```

---

## ⚠️ Important Notes

- This fix is **production-safe**
- `SECURITY DEFINER` is the correct solution for this case
- Function only checks role, doesn't modify data
- Still respects user permissions

---

## 🎉 Once Fixed

After running this migration:
- ✅ Authentication flow works end-to-end
- ✅ Users can see dashboard
- ✅ Profiles load correctly
- ✅ Admin checks work without recursion
- ✅ Ready to continue Sprint 1 development!

---

**Run the migration now to fix the issue!** 🚀

