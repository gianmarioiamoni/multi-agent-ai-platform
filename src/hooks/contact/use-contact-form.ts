/**
 * Contact Form Hook
 * Logic for contact form state management and validation
 * Following SRP: Only handles form logic, UI is separated
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { submitContactForm } from '@/lib/contact/actions';
import { useToast } from '@/contexts/toast-context';
import type { ContactFormData, ContactCategory } from '@/types/contact.types';
import { CONTACT_CATEGORIES } from '@/lib/contact/constants';

// Validation schema
const contactFormSchema = z.object({
  category: z.enum(['technical', 'commercial', 'feature', 'bug', 'partnership', 'general'], {
    message: 'Please select a category',
  }),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters'),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

interface UseContactFormOptions {
  defaultCategory?: ContactCategory;
  defaultEmail?: string;
  defaultName?: string;
}

export const useContactForm = (options: UseContactFormOptions = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success: showSuccess, error: showError } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      category: options.defaultCategory || 'general',
      name: options.defaultName || '',
      email: options.defaultEmail || '',
      subject: '',
      message: '',
    },
    mode: 'onChange',
  });

  const handleSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);

    try {
      const formData: ContactFormData = {
        category: data.category,
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      };

      const result = await submitContactForm(formData);

      if (result.success) {
        showSuccess('Message sent successfully!', 'We\'ll get back to you within 2 business days.');
        form.reset({
          category: data.category, // Keep category
          name: options.defaultName || '',
          email: options.defaultEmail || '',
          subject: '',
          message: '',
        });
      } else {
        showError('Failed to send message', result.error || 'Please try again later.');
      }
    } catch (error) {
      showError(
        'An error occurred',
        error instanceof Error ? error.message : 'Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit),
    categories: CONTACT_CATEGORIES,
  };
};

