/**
 * Subscription Constants
 * Plan definitions, limits, and pricing
 * Following SRP: Only data constants, no logic
 */

import type { SubscriptionPlanInfo } from '@/types/subscription.types';

export const SUBSCRIPTION_PLANS: SubscriptionPlanInfo[] = [
  {
    id: 'trial',
    name: 'Trial',
    description: 'Perfect for trying out the platform. 30 days free with essential features.',
    pricing: {
      monthly: 0,
      yearly: 0,
      currency: 'EUR',
    },
    limits: {
      maxAgents: 3,
      maxWorkflows: 2,
      maxRunsPerMonth: 10,
      availableTools: ['email'], // Only email tool for trial
      prioritySupport: false,
      apiAccess: false,
    },
    features: [
      '3 Agents',
      '2 Workflows',
      '10 Runs per month',
      'Email tool only',
      'Community support',
      '30 days free',
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'Great for small teams and personal projects. All essential tools included.',
    pricing: {
      monthly: 9.9,
      yearly: 99,
      currency: 'EUR',
    },
    limits: {
      maxAgents: 10,
      maxWorkflows: 5,
      maxRunsPerMonth: 100,
      availableTools: ['email', 'web_search', 'calendar'], // All base tools
      prioritySupport: false,
      apiAccess: false,
    },
    features: [
      '10 Agents',
      '5 Workflows',
      '100 Runs per month',
      'All base tools (Email, Web Search, Calendar)',
      'Email support',
      'Cancel anytime',
    ],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'For power users and teams. Unlimited resources and priority support.',
    pricing: {
      monthly: 19.9,
      yearly: 199,
      currency: 'EUR',
    },
    limits: {
      maxAgents: null, // Unlimited
      maxWorkflows: null, // Unlimited
      maxRunsPerMonth: null, // Unlimited
      availableTools: ['email', 'web_search', 'calendar', 'db_operations'], // All tools
      prioritySupport: true,
      apiAccess: true,
    },
    features: [
      'Unlimited Agents',
      'Unlimited Workflows',
      'Unlimited Runs',
      'All tools (Email, Web Search, Calendar, DB Operations)',
      'Priority support',
      'API access',
      'Cancel anytime',
    ],
  },
];

// Helper to get plan by ID
export const getPlanById = (planId: string | null): SubscriptionPlanInfo | null => {
  if (!planId) return null;
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === planId) || null;
};

// Helper to format price
export const formatPrice = (price: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

// Helper to calculate yearly savings percentage
export const calculateYearlySavings = (monthlyPrice: number, yearlyPrice: number): number => {
  const yearlyFromMonthly = monthlyPrice * 12;
  return Math.round(((yearlyFromMonthly - yearlyPrice) / yearlyFromMonthly) * 100);
};

