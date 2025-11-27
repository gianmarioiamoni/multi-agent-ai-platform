/**
 * Dashboard Getting Started Component
 * Displays onboarding steps for new users
 * Following SRP: Only handles getting started rendering
 * Server Component - static content only
 */

import Link from 'next/link';

interface GettingStartedStep {
  number: number;
  text: string;
  href: string;
}

const GETTING_STARTED_STEPS: GettingStartedStep[] = [
  { number: 1, text: 'Create your first AI agent', href: '/app/agents/create' },
  { number: 2, text: 'Configure tools for your agent', href: '/app/agents' },
  { number: 3, text: 'Build a workflow with multiple agents', href: '/app/workflows/create' },
];

export const DashboardGettingStarted = () => {
  return (
    <div className="p-6 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
      <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-4">
        📋 Getting Started
      </h2>
      <ol className="space-y-3 text-[var(--color-foreground)]">
        {GETTING_STARTED_STEPS.map((step) => (
          <li key={step.number} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-semibold">
              {step.number}
            </span>
            <Link
              href={step.href}
              className="hover:text-[var(--color-primary)] transition-colors"
            >
              {step.text}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
};

