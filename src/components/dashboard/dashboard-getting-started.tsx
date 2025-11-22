/**
 * Dashboard Getting Started Component
 * Displays onboarding steps for new users
 * Following SRP: Only handles getting started rendering
 */

interface GettingStartedStep {
  number: number;
  text: string;
  opacity: number;
}

const GETTING_STARTED_STEPS: GettingStartedStep[] = [
  { number: 1, text: 'Create your first AI agent (Sprint 2)', opacity: 1 },
  { number: 2, text: 'Configure tools for your agent', opacity: 0.5 },
  { number: 3, text: 'Build a workflow with multiple agents', opacity: 0.3 },
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
            <span 
              className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-semibold"
              style={{ opacity: step.opacity }}
            >
              {step.number}
            </span>
            <span>{step.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

