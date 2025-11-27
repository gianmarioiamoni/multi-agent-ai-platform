/**
 * Contact Form Types
 * Type definitions for contact form functionality
 */

export type ContactCategory = 
  | 'technical'
  | 'commercial'
  | 'feature'
  | 'bug'
  | 'partnership'
  | 'general';

export interface ContactCategoryOption {
  value: ContactCategory;
  label: string;
  description: string;
}

export interface ContactFormData {
  category: ContactCategory;
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormErrors {
  category?: string;
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

