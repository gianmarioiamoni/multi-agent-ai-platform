/**
 * Landing How It Works Section Component
 * Step-by-step explanation
 * Following SRP: Only handles how it works section rendering
 */

export const LandingHowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Create Agents',
      description:
        'Define specialized AI agents with specific roles, models, and tools. Each agent is optimized for its unique task.',
    },
    {
      number: '02',
      title: 'Build Workflows',
      description:
        'Orchestrate multiple agents in sequence. Define how agents pass data and collaborate to complete complex tasks.',
    },
    {
      number: '03',
      title: 'Connect Tools',
      description:
        'Integrate with email, calendars, databases, and web search. Your agents can interact with all your existing tools.',
    },
    {
      number: '04',
      title: 'Automate & Monitor',
      description:
        'Run workflows manually or on schedule. Monitor execution in real-time with detailed logs and metrics.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[var(--color-muted)]/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-foreground)] mb-4">
            How It Works
          </h2>
          <p className="text-lg text-[var(--color-muted-foreground)] max-w-2xl mx-auto">
            Get started in minutes with our intuitive platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="p-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]">
                <div className="text-5xl font-bold text-[var(--color-primary)]/20 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">
                  {step.title}
                </h3>
                <p className="text-[var(--color-muted-foreground)]">{step.description}</p>
              </div>
              {index < steps.length - 1 ? <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <svg
                    className="w-8 h-8 text-[var(--color-primary)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

