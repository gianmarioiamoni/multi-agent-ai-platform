/**
 * Landing Features Section Component
 * Features showcase section
 * Following SRP: Only handles features section rendering
 */

export const LandingFeatures = () => {
  const features = [
    {
      icon: '🤖',
      title: 'Specialized AI Agents',
      description:
        'Create agents with specific roles: research, reporting, email management, and more. Each agent is optimized for its task.',
    },
    {
      icon: '⚡',
      title: 'Multi-Agent Workflows',
      description:
        'Orchestrate multiple agents in sequence to handle complex tasks. Pass data between agents automatically.',
    },
    {
      icon: '🔧',
      title: 'Powerful Tools',
      description:
        'Connect to web search, email, calendars, and databases. Agents can interact with your existing tools seamlessly.',
    },
    {
      icon: '📊',
      title: 'Workflow Automation',
      description:
        'Automate repetitive business processes with visual workflow builders. Set it up once and let it run automatically.',
    },
    {
      icon: '🔍',
      title: 'Real-time Monitoring',
      description:
        'Track every step of workflow execution with detailed logs, tool calls, and performance metrics.',
    },
    {
      icon: '🔒',
      title: 'Enterprise Security',
      description:
        'Built with security in mind. Encrypted credentials, role-based access control, and audit logs.',
    },
  ];

  return (
    <section id="features" className="py-24 bg-[var(--color-background)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-foreground)] mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-[var(--color-muted-foreground)] max-w-2xl mx-auto">
            Everything you need to automate your business workflows with AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-primary)] hover:shadow-lg transition-all"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">
                {feature.title}
              </h3>
              <p className="text-[var(--color-muted-foreground)]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

