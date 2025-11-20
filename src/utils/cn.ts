/**
 * Centralized Class Name Utility
 * Merges Tailwind CSS classes without conflicts
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

