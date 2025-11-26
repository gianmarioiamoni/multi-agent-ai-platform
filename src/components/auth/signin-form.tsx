/**
 * Sign In Form Component
 * Form for user login with email/password and OAuth
 * Following SRP: Only handles composition of signin form
 */

'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { signInSchema, type SignInFormData } from '@/lib/validations/auth';
import { useSignIn } from '@/hooks/auth/use-signin';
import { useToast } from '@/contexts/toast-context';
import { GoogleButton } from '@/components/ui/google-button';
import { AuthDivider } from '@/components/ui/auth-divider';
import { AuthFooter } from '@/components/ui/auth-footer';
import { EmailForm } from './signin-form/email-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const SignInForm = () => {
  const { info, error: showError } = useToast();
  const searchParams = useSearchParams();
  const { isLoading, isGoogleLoading, handleEmailSignIn, handleGoogleSignIn } = useSignIn();

  // Show info/error toasts based on query parameters
  useEffect(() => {
    if (searchParams.get('verified') === 'false') {
      info(
        'Check your email',
        'We sent you a verification link. Please verify your email before signing in.'
      );
    }

    const errorParam = searchParams.get('error');
    if (errorParam) {
      const errorMessage = decodeURIComponent(errorParam);
      if (errorMessage.toLowerCase().includes('disabled')) {
        showError(
          'Account disabled',
          errorMessage
        );
      } else {
        showError('Sign in failed', errorMessage);
      }
    }
  }, [searchParams, info, showError]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    await handleEmailSignIn(data.email, data.password);
  };

  const isAnyLoading = isLoading || isGoogleLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in to your account</CardTitle>
        <CardDescription>
          Enter your credentials below to access your account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <GoogleButton
          onClick={handleGoogleSignIn}
          isLoading={isGoogleLoading}
          disabled={isAnyLoading}
        />

        <AuthDivider />

        <EmailForm
          register={register}
          errors={errors}
          isLoading={isLoading}
          isDisabled={isAnyLoading}
          onSubmit={handleSubmit(onSubmit)}
        />
      </CardContent>

      <CardFooter>
        <AuthFooter
          text="Don't have an account?"
          linkText="Sign up"
          linkHref="/auth/signup"
          disabled={isAnyLoading}
        />
      </CardFooter>
    </Card>
  );
};

