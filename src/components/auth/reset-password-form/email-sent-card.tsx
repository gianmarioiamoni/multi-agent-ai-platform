/**
 * Email Sent Card Component
 * Shows confirmation message after password reset email is sent
 * Following SRP: Only handles email sent confirmation UI
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

export const EmailSentCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Check Your Email</CardTitle>
        <CardDescription>
          We&apos;ve sent you a password reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Please check your email and click the link to reset your password.
          The link will expire in 1 hour.
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

