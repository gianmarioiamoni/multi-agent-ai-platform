/**
 * Centralized Navigation Types
 * Types for navigation menu items, routes, and user menu
 */

import type { ReactNode } from 'react';

export interface NavItem {
  label: string;
  href: string;
  icon?: ReactNode;
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
  icon?: ReactNode;
  variant?: 'default' | 'destructive';
  separator?: boolean;
}

