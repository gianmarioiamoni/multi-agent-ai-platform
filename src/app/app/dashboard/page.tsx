/**
 * Dashboard Page
 * Main dashboard for authenticated users
 * Server Component
 */

import type { Metadata } from 'next';
import { getCurrentUserProfile } from '@/lib/auth/utils';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your AI agents and workflows',
};

export default async function DashboardPage() {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect('/auth/login');
  }

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-h1">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {profile.name || 'there'}!
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-h4 mb-2">Agents</h3>
            <p className="text-small">Manage your AI agents</p>
            <p className="text-2xl font-bold mt-4">0</p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-h4 mb-2">Workflows</h3>
            <p className="text-small">Active workflow automations</p>
            <p className="text-2xl font-bold mt-4">0</p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-h4 mb-2">Runs</h3>
            <p className="text-small">Total workflow executions</p>
            <p className="text-2xl font-bold mt-4">0</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-h4 mb-4">Getting Started</h3>
          <p className="text-body mb-4">
            Welcome to the Multi-Agent AI Platform! Here's how to get started:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-body">
            <li>Create your first AI agent (Coming in Sprint 2)</li>
            <li>Configure tools for your agent</li>
            <li>Build a workflow with multiple agents</li>
            <li>Run and monitor your automation</li>
          </ol>
        </div>

        <div className="rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 p-6">
          <h3 className="text-h4 mb-2">🎯 Sprint 1 Progress</h3>
          <p className="text-body">
            ✅ Authentication and user management completed!
            <br />
            ⏭️ Next: Base layout with navigation (Week 1)
            <br />
            ⏭️ After: Admin tools and middleware (Week 2)
          </p>
        </div>
      </div>
    </div>
  );
}

