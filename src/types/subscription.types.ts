/**
 * Subscription Types
 * Type definitions for subscription plans and features
 * Following SRP: Only type definitions
 */

export type SubscriptionPlan = 'trial' | 'basic' | 'premium';

export type BillingCycle = 'monthly' | 'yearly';

export interface PlanLimits {
  maxAgents: number | null; // null = unlimited
  maxWorkflows: number | null; // null = unlimited
  maxRunsPerMonth: number | null; // null = unlimited
  availableTools: string[]; // Tool IDs available for this plan
  prioritySupport: boolean;
  apiAccess: boolean;
}

export interface PlanPricing {
  monthly: number;
  yearly: number;
  currency: string;
}

export interface SubscriptionPlanInfo {
  id: SubscriptionPlan;
  name: string;
  description: string;
  pricing: PlanPricing;
  limits: PlanLimits;
  features: string[];
  popular?: boolean;
}

export interface UserSubscription {
  plan: SubscriptionPlan | null;
  expiresAt: string | null;
  isActive: boolean;
  isTrial: boolean;
  daysRemaining: number | null;
}

