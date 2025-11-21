/**
 * Centralized Navigation Types
 * Types for navigation menu items, routes, and user menu
 */

import type { IconName } from '@/components/icons';

export interface NavItem {
  label: string;
  href: string;
  icon?: IconName;
  badge?: string | number;
  adminOnly?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface UserMenuAction {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: IconName;
  variant?: 'default' | 'destructive';
  separator?: boolean;
}

