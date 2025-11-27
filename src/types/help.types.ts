/**
 * Help Center Types
 * Type definitions for help center content
 * Following SRP: Only type definitions
 */

export interface FAQItem {
  question: string;
  answer: string;
  category?: 'general' | 'agents' | 'workflows' | 'integrations' | 'troubleshooting';
}

export interface HelpResource {
  title: string;
  description: string;
  href: string;
  icon: 'book' | 'mail' | 'external';
  external?: boolean;
}

export interface QuickInfoItem {
  title: string;
  description: string;
  icon: 'lightbulb' | 'rocket' | 'shield' | 'zap';
}

