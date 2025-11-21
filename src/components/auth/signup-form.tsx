/**
 * Sign Up Form Component
 * Form for user registration with email/password
 * Following SRP: Only handles composition of signup form
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, type SignUpFormData } from '@/lib/validations/auth';
import { useSignUp } from '@/hooks/use-signup';
import { AuthFooter } from '@/components/ui/auth-footer';
import { EmailForm } from './signup-form/email-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const SignUpForm = () => {
  const { isLoading, handleSignUp } = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    await handleSignUp(data.email, data.password, data.name || '');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <EmailForm
          register={register}
          errors={errors}
          isLoading={isLoading}
          onSubmit={handleSubmit(onSubmit)}
        />
      </CardContent>

      <CardFooter>
        <AuthFooter
          text="Already have an account?"
          linkText="Sign in"
          linkHref="/auth/login"
          disabled={isLoading}
        />
      </CardFooter>
    </Card>
  );
};

