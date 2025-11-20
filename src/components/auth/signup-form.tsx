/**
 * Sign Up Form Component
 * Form for user registration with email/password
 * Following SRP: Only handles signup form UI and validation
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUpSchema, type SignUpFormData } from '@/lib/validations/auth';
import { signUp } from '@/lib/auth/actions';
import { useToast } from '@/contexts/toast-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const SignUpForm = () => {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);

    try {
      const result = await signUp(data.email, data.password, data.name);

      if (result.success) {
        success(
          'Account created!',
          'Please check your email to verify your account.'
        );
        // Wait a bit before redirecting
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        showError('Sign up failed', result.error);
      }
    } catch (err) {
      showError(
        'An error occurred',
        err instanceof Error ? err.message : 'Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              autoComplete="name"
              error={errors.name?.message}
              disabled={isLoading}
              {...register('name')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" required>
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              autoComplete="email"
              error={errors.email?.message}
              disabled={isLoading}
              {...register('email')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" required>
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              error={errors.password?.message}
              disabled={isLoading}
              {...register('password')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" required>
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              disabled={isLoading}
              {...register('confirmPassword')}
            />
          </div>

          <Button type="submit" fullWidth isLoading={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

