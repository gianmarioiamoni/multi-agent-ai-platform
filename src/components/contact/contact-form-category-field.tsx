/**
 * Contact Form Category Field Component
 * Category selection field for contact form
 * Following SRP: Only handles category field UI
 */

'use client';

import { Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import type { ContactFormValues } from '@/hooks/contact/use-contact-form';
import type { ContactCategoryOption } from '@/types/contact.types';

interface ContactFormCategoryFieldProps {
  control: any; // React Hook Form control
  categories: ContactCategoryOption[];
  error?: string;
}

export const ContactFormCategoryField = ({
  control,
  categories,
  error,
}: ContactFormCategoryFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="category">
        Category <span className="text-[var(--color-destructive)]">*</span>
      </Label>
      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <>
            <select
              {...field}
              id="category"
              className="flex h-10 w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm ring-offset-[var(--color-background)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {error && (
              <p className="text-sm text-[var(--color-destructive)]" role="alert">
                {error}
              </p>
            )}
            <p className="text-xs text-[var(--color-muted-foreground)]">
              {categories.find((c) => c.value === field.value)?.description}
            </p>
          </>
        )}
      />
    </div>
  );
};

