/**
 * Reset Password Form Component
 * Form for requesting password reset email
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations/auth';
import { resetPassword } from '@/lib/auth/actions';
import { useToast } from '@/contexts/toast-context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export const ResetPasswordForm = () => {
  const { success, error: showError } = useToast();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  // Check if we have a token from the reset link
  const token = searchParams.get('token');
  const type = searchParams.get('type');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);

    try {
      // CSRF token is optional for password reset
      const result = await resetPassword(data.email);

      if (result.success) {
        setEmailSent(true);
        success(
          'Reset email sent',
          'Please check your email for password reset instructions.'
        );
      } else {
        showError('Failed to send reset email', result.error);
        setIsLoading(false);
      }
    } catch (err) {
      showError(
        'An error occurred',
        err instanceof Error ? err.message : 'Please try again later.'
      );
      setIsLoading(false);
    }
  };

  // If we have a token, this is the actual password reset (from email link)
  // For now, we'll just show a message that they should use the link from email
  if (token && type === 'recovery') {
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
          <Link href="/auth/login" className="text-sm text-[var(--color-primary)] hover:underline">
            Back to Sign In
          </Link>
        </CardFooter>
      </Card>
    );
  }

  if (emailSent) {
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
          <Link href="/auth/login" className="text-sm text-[var(--color-primary)] hover:underline">
            Back to Sign In
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a link to reset your password
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[var(--color-foreground)] mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="your@email.com"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-[var(--color-destructive)]">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      </CardContent>

      <CardFooter>
        <Link
          href="/auth/login"
          className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors"
        >
          Back to Sign In
        </Link>
      </CardFooter>
    </Card>
  );
};

