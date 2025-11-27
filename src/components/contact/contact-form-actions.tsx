/**
 * Contact Form Actions Component
 * Submit button and form actions
 * Following SRP: Only handles action buttons
 */

'use client';

import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface ContactFormActionsProps {
  isSubmitting: boolean;
}

export const ContactFormActions = ({ isSubmitting }: ContactFormActionsProps) => {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
      <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
        <Send className="w-4 h-4 mr-2" />
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </div>
  );
};

