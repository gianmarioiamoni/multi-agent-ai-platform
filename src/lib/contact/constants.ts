/**
 * Contact Form Constants
 * Centralized constants for contact form
 */

import type { ContactCategoryOption } from '@/types/contact.types';

export const CONTACT_CATEGORIES: ContactCategoryOption[] = [
  {
    value: 'technical',
    label: 'Technical Support',
    description: 'Get help with technical issues, setup, or troubleshooting',
  },
  {
    value: 'commercial',
    label: 'Commercial Inquiry',
    description: 'Questions about pricing, plans, or enterprise solutions',
  },
  {
    value: 'feature',
    label: 'Feature Request',
    description: 'Suggest a new feature or enhancement',
  },
  {
    value: 'bug',
    label: 'Bug Report',
    description: 'Report a bug or unexpected behavior',
  },
  {
    value: 'partnership',
    label: 'Partnership',
    description: 'Interested in partnerships or collaborations',
  },
  {
    value: 'general',
    label: 'General Inquiry',
    description: 'Any other questions or requests',
  },
];

export const CONTACT_RESPONSE_DAYS = 2;

