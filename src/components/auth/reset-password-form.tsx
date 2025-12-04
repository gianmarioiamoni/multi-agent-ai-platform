/**
 * Reset Password Form Component
 * Main composition component for password reset
 * Following SRP: Only handles component composition
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations/auth';
import { useResetPassword } from '@/hooks/auth/use-reset-password';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ResetPasswordEmailForm } from './reset-password-form/reset-password-email-form';
import { EmailSentCard } from './reset-password-form/email-sent-card';
import { TokenRecoveryCard } from './reset-password-form/token-recovery-card';

export const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const { isLoading, emailSent, handleResetPassword } = useResetPassword();
  
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
    await handleResetPassword(data.email);
  };

  // If we have a token, this is the actual password reset (from email link)
  if (token && type === 'recovery') {
    return <TokenRecoveryCard />;
  }

  // If email was sent successfully, show confirmation
  if (emailSent) {
    return <EmailSentCard />;
  }

  // Default: show email input form
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a link to reset your password
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ResetPasswordEmailForm
          register={register}
          errors={errors}
          isLoading={isLoading}
          onSubmit={handleSubmit(onSubmit)}
        />
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

