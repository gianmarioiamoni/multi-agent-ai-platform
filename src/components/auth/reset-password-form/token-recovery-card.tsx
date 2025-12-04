/**
 * Token Recovery Card Component
 * Shows message when user arrives with recovery token from email
 * Following SRP: Only handles token recovery UI
 */

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const TokenRecoveryCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset Your Password</CardTitle>
        <CardDescription>
          Please use the link from your email to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          If you clicked the link from your email, you should be redirected automatically.
          If not, please check your email for the reset link.
        </p>
      </CardContent>
      <CardFooter>
        <Link
          href="/auth/login"
          className="text-sm text-[var(--color-primary)] hover:underline"
        >
          Back to Sign In
        </Link>
      </CardFooter>
    </Card>
  );
};

