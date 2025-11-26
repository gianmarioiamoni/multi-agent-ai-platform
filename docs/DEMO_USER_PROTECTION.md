# Demo User Protection

## Overview

The platform includes protection mechanisms for demo user accounts to prevent unauthorized modifications. Demo users are identified by the `is_demo` boolean flag in the `profiles` table. Administrators can set or unset this flag via the admin panel.

## Configuration

Demo users are managed via the database flag `is_demo` in the `profiles` table:

1. **Via Admin Panel** (Recommended):
   - Go to `/admin` page
   - Find the user in the users table
   - Click "Set as Demo" button in the Demo column
   - To remove demo status, click "Remove Demo" button

2. **Via Database** (Direct):
   ```sql
   UPDATE profiles
   SET is_demo = true
   WHERE user_id = 'user-id-here';
   ```

**Note**: The `DEMO_USER_LOGIN` environment variable is no longer used. All demo user management is done via the database flag.

## Protected Actions

The following actions are **blocked** for the demo user:

### 1. Password Change

The demo user **cannot** change their password through the `updatePassword` server action.

**Error message**: `"Password changes are not allowed for the demo account. Please contact support if you need to change your password."`

**Implementation**: `src/lib/auth/actions.ts` → `updatePassword()`

### 2. Account Deletion

The demo user **cannot** delete their account through the `deleteAccount` server action.

**Error message**: `"Account deletion is not allowed for the demo account. Please contact support if you need to delete your account."`

**Implementation**: `src/lib/auth/account-deletion.ts` → `deleteAccount()`

## Implementation Details

### Demo User Identification

The demo user is identified using the `isDemoUser()` utility function or directly from the user profile:

```typescript
import { isDemoUser } from '@/lib/auth/demo-user';
import { getCurrentUserProfile } from '@/lib/auth/utils';

// Method 1: Check via utility function
const isDemo = await isDemoUser();

// Method 2: Get from profile (already includes isDemo)
const profile = await getCurrentUserProfile();
const isDemo = profile?.isDemo === true;
```

**Location**: `src/lib/auth/demo-user.ts`

**Logic**:
1. Retrieves current user profile from database
2. Checks `is_demo` flag in the profiles table
3. Returns `true` if flag is set, `false` otherwise

### Protection Mechanism

Both protected actions follow the same pattern:

1. Check if current user is demo user using `isDemoUser()`
2. If demo user, return error response immediately
3. If not demo user, proceed with normal operation

### Server Actions

#### Update Password

```typescript
// src/lib/auth/actions.ts
export const updatePassword = async (
  newPassword: string
): Promise<AuthResponse> => {
  const isDemo = await isDemoUser();
  
  if (isDemo) {
    return {
      success: false,
      error: 'Password changes are not allowed...',
    };
  }
  
  // ... proceed with password update
};
```

#### Delete Account

```typescript
// src/lib/auth/account-deletion.ts
export async function deleteAccount(): Promise<AccountDeletionResponse> {
  const isDemo = await isDemoUser();
  
  if (isDemo) {
    return {
      success: false,
      error: 'Account deletion is not allowed...',
    };
  }
  
  // ... proceed with account deletion
};
```

## Adding New Protected Actions

To protect additional actions for the demo user:

1. Import `isDemoUser` from `@/lib/auth/demo-user`
2. Check if user is demo user at the start of the action
3. Return error response if demo user
4. Proceed normally if not demo user

Example:

```typescript
import { isDemoUser } from '@/lib/auth/demo-user';

export async function myProtectedAction() {
  const isDemo = await isDemoUser();
  
  if (isDemo) {
    return {
      success: false,
      error: 'This action is not allowed for the demo account.',
    };
  }
  
  // ... normal action logic
}
```

## Admin Management

### Setting a User as Demo

1. Navigate to `/admin` page
2. Find the user in the users table
3. In the "Demo" column, click "Set as Demo" button
4. User will immediately be marked as demo and restrictions will apply

### Removing Demo Status

1. Navigate to `/admin` page
2. Find the demo user (will have a "DEMO" badge)
3. Click "Remove Demo" button
4. User will no longer be restricted

## Testing

### Test Demo User Protection

1. Mark a test user as demo via admin panel (`/admin`)
2. Sign in with that user
3. Attempt to change password → should be blocked
4. Attempt to delete account → should be blocked
5. Notice demo mode banner and badge in UI

### Test Normal User

1. Sign in with a non-demo user
2. Attempt to change password → should work normally
3. Attempt to delete account → should work normally

## Security Notes

- The demo status is stored in the **database** (`profiles.is_demo` flag)
- Protection is enforced at the **server action level**, not just UI level
- Only **admins** can set/unset demo flag
- Admins **cannot** change their own demo status
- The flag persists across sessions and devices

## UI Indicators

When logged in as the demo user, the following UI indicators are displayed:

### 1. Demo Mode Banner

A prominent banner at the top of every page (above the navbar) indicates demo mode:

- **Location**: Top of the page (sticky)
- **Component**: `src/components/demo/demo-mode-banner.tsx`
- **Message**: "Demo Mode — You are logged in with a demo account. Some features are restricted."
- **Visibility**: Always visible when logged in as demo user

### 2. Demo Badge

A small "DEMO" badge appears next to the user's name:

- **Location**: 
  - User menu button (desktop)
  - User dropdown menu (mobile)
- **Component**: `src/components/demo/demo-badge.tsx`
- **Visibility**: Shown whenever user info is displayed

### 3. Restrictions Notice

A detailed notice in the account page listing all restricted features:

- **Location**: `/app/account` page
- **Component**: `src/components/demo/demo-restrictions-notice.tsx`
- **Content**: Lists password change and account deletion restrictions
- **Visibility**: Only shown on account page for demo users

### Implementation

All UI components are conditionally rendered based on `isDemo` flag:

```typescript
// In layout
const isDemo = await isDemoUser();

// Pass to client components
<AppLayoutClient user={profile} isDemo={isDemo}>
  {children}
</AppLayoutClient>
```

## Future Enhancements

Potential improvements:
- Add database flag to mark demo user (instead of env variable)
- Add admin override to bypass protection
- Add audit logging for blocked actions

