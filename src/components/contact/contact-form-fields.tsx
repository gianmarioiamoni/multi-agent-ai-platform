/**
 * Contact Form Fields Component
 * All form fields except category
 * Following SRP: Only handles field rendering
 */

'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { ContactFormValues } from '@/hooks/contact/use-contact-form';

interface ContactFormFieldsProps {
  errors: {
    name?: { message?: string };
    email?: { message?: string };
    subject?: { message?: string };
    message?: { message?: string };
  };
}

export const ContactFormFields = ({ errors }: ContactFormFieldsProps) => {
  const { register } = useFormContext<ContactFormValues>();

  return (
    <div className="space-y-4">
      {/* Name */}
      <div>
        <Label htmlFor="name" required>
          Name
        </Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Your full name"
          error={errors.name?.message}
          fullWidth
        />
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="email" required>
          Email
        </Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          placeholder="your.email@example.com"
          error={errors.email?.message}
          fullWidth
        />
      </div>

      {/* Subject */}
      <div>
        <Label htmlFor="subject" required>
          Subject
        </Label>
        <Input
          id="subject"
          {...register('subject')}
          placeholder="Brief description of your inquiry"
          error={errors.subject?.message}
          fullWidth
        />
      </div>

      {/* Message */}
      <div>
        <Label htmlFor="message" required>
          Message
        </Label>
        <Textarea
          id="message"
          {...register('message')}
          placeholder="Please provide details about your inquiry..."
          error={errors.message?.message}
          fullWidth
          rows={8}
        />
        <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
          Maximum 2000 characters
        </p>
      </div>
    </div>
  );
};

