/**
 * Dashboard Page
 * Main dashboard for authenticated users
 * Server Component
 */

import type { Metadata } from 'next';
import { getCurrentUserProfile } from '@/lib/auth/utils';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your AI agents and workflows',
};

export default async function DashboardPage() {
  const profile = await getCurrentUserProfile();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-[var(--color-foreground)]">
          Dashboard
        </h1>
        <p className="text-[var(--color-muted-foreground)] mt-2">
          Welcome back, <span className="font-semibold text-[var(--color-foreground)]">{profile?.name || 'there'}</span>! 
          Here's what's happening with your AI agents today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Agents', value: '0', icon: '🤖' },
          { label: 'Workflows', value: '0', icon: '⚡' },
          { label: 'Runs Today', value: '0', icon: '📊' },
          { label: 'Success Rate', value: '0%', icon: '✅' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{stat.icon}</span>
              <span className="text-xs font-semibold text-[var(--color-muted-foreground)] uppercase">
                {stat.label}
              </span>
            </div>
            <div className="text-3xl font-bold text-[var(--color-foreground)]">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
          <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-4">
            🚀 Quick Actions
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Create New Agent', href: '#', soon: true },
              { label: 'Build Workflow', href: '#', soon: true },
              { label: 'View Integrations', href: '#', soon: true },
            ].map((action) => (
              <button
                key={action.label}
                className="w-full px-4 py-3 text-left rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-accent)]/10 hover:border-[var(--color-accent)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={action.soon}
              >
                <span className="text-[var(--color-foreground)]">{action.label}</span>
                {action.soon && (
                  <span className="ml-2 text-xs text-[var(--color-muted-foreground)]">
                    (Coming Soon)
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
          <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-4">
            📋 Getting Started
          </h2>
          <ol className="space-y-3 text-[var(--color-foreground)]">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-semibold">
                1
              </span>
              <span>Create your first AI agent (Sprint 2)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-primary)]/50 text-white flex items-center justify-center text-sm font-semibold">
                2
              </span>
              <span>Configure tools for your agent</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-primary)]/30 text-white flex items-center justify-center text-sm font-semibold">
                3
              </span>
              <span>Build a workflow with multiple agents</span>
            </li>
          </ol>
        </div>
      </div>

      {/* Sprint Progress */}
      <div className="p-6 rounded-lg bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 border border-[var(--color-primary)]/20">
        <h3 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">
          🎯 Sprint 1 Progress
        </h3>
        <div className="space-y-2 text-[var(--color-foreground)]">
          <p>✅ Authentication and user management</p>
          <p>✅ Google OAuth integration</p>
          <p>✅ Base layout with navigation</p>
          <p className="text-[var(--color-accent)] font-semibold">⏭️ Next: Admin tools and middleware (Week 2)</p>
        </div>
      </div>
    </div>
  );
}

