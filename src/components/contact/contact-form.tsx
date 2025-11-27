/**
 * Contact Form Component
 * Main contact form composition component
 * Following SRP: Only handles form composition
 */

'use client';

import { FormProvider } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useContactForm } from '@/hooks/contact/use-contact-form';
import { ContactFormCategoryField } from './contact-form-category-field';
import { ContactFormFields } from './contact-form-fields';
import { ContactFormActions } from './contact-form-actions';
import type { ContactCategory } from '@/types/contact.types';

interface ContactFormProps {
  defaultCategory?: ContactCategory;
  defaultEmail?: string;
  defaultName?: string;
}

export const ContactForm = ({ defaultCategory, defaultEmail, defaultName }: ContactFormProps) => {
  const { form, isSubmitting, handleSubmit, categories } = useContactForm({
    defaultCategory,
    defaultEmail,
    defaultName,
  });

  const {
    formState: { errors },
  } = form;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Us</CardTitle>
        <CardDescription>
          Fill out the form below and we'll get back to you within 2 business days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category */}
            <ContactFormCategoryField
              control={form.control}
              categories={categories}
              error={errors.category?.message}
            />

            {/* Other Fields */}
            <ContactFormFields errors={errors} />

            {/* Actions */}
            <ContactFormActions isSubmitting={isSubmitting} />
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

